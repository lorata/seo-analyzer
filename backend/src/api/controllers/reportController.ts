import { Request, Response } from 'express';
import pool from '../../utils/db';
import { logger } from '../../utils/logger';
import { ReportService } from '../services/reportService';

const reportService = new ReportService();

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { auditId, reportType = 'pdf' } = req.body;

    if (!auditId) {
      return res.status(400).json({ error: 'auditId is required' });
    }

    if (!['pdf', 'excel', 'both'].includes(reportType)) {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    // Create report record
    const result = await pool.query(
      `INSERT INTO reports (audit_id, report_type, status, created_at, expires_at)
       VALUES ($1, $2, 'generating', NOW(), NOW() + INTERVAL '30 days')
       RETURNING *`,
      [auditId, reportType]
    );

    const report = result.rows[0];

    // Queue report generation
    reportService.queueReportGeneration(report.id, auditId, reportType).catch(err => {
      logger.error('Failed to queue report generation:', err);
    });

    res.status(201).json(report);
  } catch (err) {
    logger.error('Generate report error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    const result = await pool.query(
      `SELECT * FROM reports WHERE id = $1`,
      [reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Get report error:', err);
    res.status(500).json({ error: 'Failed to get report' });
  }
};

export const downloadReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;

    const result = await pool.query(
      `SELECT * FROM reports WHERE id = $1`,
      [reportId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = result.rows[0];

    if (report.status !== 'ready') {
      return res.status(400).json({ error: 'Report is not ready for download' });
    }

    // Serve the file
    res.download(report.file_path, `report-${report.id}.${report.report_type}`);
  } catch (err) {
    logger.error('Download report error:', err);
    res.status(500).json({ error: 'Failed to download report' });
  }
};

export const listReports = async (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = ((Number(page) - 1) * Number(limit));

    const result = await pool.query(
      `SELECT * FROM reports WHERE audit_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [auditId, Number(limit), offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM reports WHERE audit_id = $1`,
      [auditId]
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    logger.error('List reports error:', err);
    res.status(500).json({ error: 'Failed to list reports' });
  }
};
