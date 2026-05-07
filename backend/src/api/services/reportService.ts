import pool from '../../utils/db';
import { logger } from '../../utils/logger';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export class ReportService {
  async queueReportGeneration(reportId: string, auditId: string, reportType: string) {
    try {
      if (reportType === 'pdf' || reportType === 'both') {
        await this.generatePdfReport(reportId, auditId);
      }
      if (reportType === 'excel' || reportType === 'both') {
        await this.generateExcelReport(reportId, auditId);
      }

      await pool.query(
        `UPDATE reports SET status = 'ready' WHERE id = $1`,
        [reportId]
      );
    } catch (err) {
      logger.error('Report generation error:', err);
      await pool.query(
        `UPDATE reports SET status = 'failed' WHERE id = $1`,
        [reportId]
      );
    }
  }

  private async generatePdfReport(reportId: string, auditId: string) {
    const auditResult = await pool.query(
      `SELECT a.*, w.domain, w.name FROM audits a
       JOIN websites w ON a.website_id = w.id
       WHERE a.id = $1`,
      [auditId]
    );

    const issuesResult = await pool.query(
      `SELECT * FROM audit_issues WHERE audit_id = $1 ORDER BY priority DESC`,
      [auditId]
    );

    const audit = auditResult.rows[0];
    const issues = issuesResult.rows;

    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `report-${reportId}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    doc.fontSize(24).text('SEO Audit Report', { align: 'center' });
    doc.fontSize(12).text(`${audit.name} (${audit.domain})`, { align: 'center' });
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Executive Summary');
    doc.fontSize(11);
    doc.text(`Total Issues: ${issues.length}`);
    doc.text(`Critical: ${issues.filter(i => i.type === 'critical').length}`);
    doc.text(`Warnings: ${issues.filter(i => i.type === 'warning').length}`);
    doc.text(`Info: ${issues.filter(i => i.type === 'info').length}`);

    doc.moveDown();

    // Issues
    doc.fontSize(14).text('Issues Found');
    issues.slice(0, 50).forEach((issue, index) => {
      doc.fontSize(11).text(`${index + 1}. ${issue.title}`, { underline: true });
      doc.fontSize(10).text(`Type: ${issue.type.toUpperCase()}`);
      doc.text(`Description: ${issue.description}`);
      doc.text(`Recommendation: ${issue.recommendation}`);
      doc.text(`How to Fix: ${issue.how_to_fix}`);
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  private async generateExcelReport(reportId: string, auditId: string) {
    const auditResult = await pool.query(
      `SELECT a.*, w.domain, w.name FROM audits a
       JOIN websites w ON a.website_id = w.id
       WHERE a.id = $1`,
      [auditId]
    );

    const issuesResult = await pool.query(
      `SELECT * FROM audit_issues WHERE audit_id = $1 ORDER BY priority DESC`,
      [auditId]
    );

    const audit = auditResult.rows[0];
    const issues = issuesResult.rows;

    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Summary');
    const issuesSheet = workbook.addWorksheet('Issues');

    // Summary
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 20 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    summarySheet.addRows([
      { metric: 'Website', value: audit.name },
      { metric: 'Domain', value: audit.domain },
      { metric: 'Report Date', value: new Date().toLocaleDateString() },
      { metric: 'Total Issues', value: issues.length },
      { metric: 'Critical', value: issues.filter(i => i.type === 'critical').length },
      { metric: 'Warnings', value: issues.filter(i => i.type === 'warning').length },
      { metric: 'Info', value: issues.filter(i => i.type === 'info').length }
    ]);

    // Issues
    issuesSheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Recommendation', key: 'recommendation', width: 40 },
      { header: 'How to Fix', key: 'how_to_fix', width: 40 },
      { header: 'Affected Pages', key: 'affected_pages', width: 15 }
    ];

    issuesSheet.addRows(issues);

    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `report-${reportId}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
  }
}
