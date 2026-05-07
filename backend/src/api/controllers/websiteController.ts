import { Request, Response } from 'express';
import pool from '../../utils/db';
import { logger } from '../../utils/logger';
import Joi from 'joi';

const websiteSchema = Joi.object({
  domain: Joi.string().uri().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  pageCount: Joi.number().min(1).max(500).required()
});

export const createWebsite = async (req: Request, res: Response) => {
  try {
    const { error, value } = websiteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { domain, name, description, pageCount } = value;
    
    const result = await pool.query(
      `INSERT INTO websites (domain, name, description, page_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [domain, name, description || null, pageCount]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error('Create website error:', err);
    res.status(500).json({ error: 'Failed to create website' });
  }
};

export const getWebsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM websites WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Get website error:', err);
    res.status(500).json({ error: 'Failed to get website' });
  }
};

export const listWebsites = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = ((Number(page) - 1) * Number(limit));

    const result = await pool.query(
      `SELECT * FROM websites ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [Number(limit), offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM websites');

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    logger.error('List websites error:', err);
    res.status(500).json({ error: 'Failed to list websites' });
  }
};

export const updateWebsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, pageCount } = req.body;

    const result = await pool.query(
      `UPDATE websites SET name = COALESCE($1, name),
       description = COALESCE($2, description),
       page_count = COALESCE($3, page_count),
       updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [name, description, pageCount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    logger.error('Update website error:', err);
    res.status(500).json({ error: 'Failed to update website' });
  }
};

export const deleteWebsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM websites WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json({ message: 'Website deleted successfully' });
  } catch (err) {
    logger.error('Delete website error:', err);
    res.status(500).json({ error: 'Failed to delete website' });
  }
};
