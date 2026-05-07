import { Request, Response } from 'express';
import pool from '../../utils/db';
import redisClient from '../../utils/cache';
import { logger } from '../../utils/logger';
import { AuditService } from '../services/auditService';

const auditService = new AuditService();

export const startAudit = async (req: Request, res: Response) => {
  try {
    const { websiteId } = req.body;

    if (!websiteId) {
      return res.status(400).json({ error: 'websiteId is required' });
    }

    // Create audit record
    const auditResult = await pool.query(
      `INSERT INTO audits (website_id, status, created_at)
       VALUES ($1, 'pending', NOW())
       RETURNING *`,
      [websiteId]
    );

    const audit = auditResult.rows[0];

    // Queue audit job
    auditService.queueAudit(audit.id, websiteId).catch(err => {
      logger.error('Failed to queue audit:', err);
    });

    res.status(201).json(audit);
  } catch (err) {
    logger.error('Start audit error:', err);
    res.status(500).json({ error: 'Failed to start audit' });
  }
};

export const getAudit = async (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;

    // Try cache first
    const cached = await redisClient.get(`audit:${auditId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      `SELECT * FROM audits WHERE id = $1`,
      [auditId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    const audit = result.rows[0];

    // Cache for 1 hour
    await redisClient.setEx(`audit:${auditId}`, 3600, JSON.stringify(audit));

    res.json(audit);
  } catch (err) {
    logger.error('Get audit error:', err);
    res.status(500).json({ error: 'Failed to get audit' });
  }
};

export const getAuditIssues = async (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;
    const { severity, page = 1, limit = 20 } = req.query;

    let query = `SELECT * FROM audit_issues WHERE audit_id = $1`;
    const params: any[] = [auditId];

    if (severity) {
      query += ` AND type = $${params.length + 1}`;
      params.push(severity);
    }

    query += ` ORDER BY priority DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), ((Number(page) - 1) * Number(limit)));

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM audit_issues WHERE audit_id = $1`,
      [auditId]
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    logger.error('Get audit issues error:', err);
    res.status(500).json({ error: 'Failed to get audit issues' });
  }
};

export const getAuditReport = async (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;

    const result = await pool.query(
      `SELECT 
        a.*,
        COUNT(ai.id) as total_issues,
        SUM(CASE WHEN ai.type = 'critical' THEN 1 ELSE 0 END) as critical_issues,
        SUM(CASE WHEN ai.type = 'warning' THEN 1 ELSE 0 END) as warning_issues,
        SUM(CASE WHEN ai.type = 'info' THEN 1 ELSE 0 END) as info_issues
       FROM audits a
       LEFT JOIN audit_issues ai ON a.id = ai.audit_id
       WHERE a.id = $1
       GROUP BY a.id`,
      [auditId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Get audit report error:', err);
    res.status(500).json({ error: 'Failed to get audit report' });
  }
};
