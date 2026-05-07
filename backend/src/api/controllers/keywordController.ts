import { Request, Response } from 'express';
import pool from '../../utils/db';
import { logger } from '../../utils/logger';

export const researchKeywords = async (req: Request, res: Response) => {
  try {
    const { query, limit = 20 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // In production, integrate with SerpAPI or similar
    // For now, returning mock data
    const keywords = [
      {
        keyword: query,
        searchVolume: 5400,
        difficulty: 42,
        cpc: 2.5,
        trend: 'stable'
      },
      {
        keyword: `${query} guide`,
        searchVolume: 2100,
        difficulty: 28,
        cpc: 1.8,
        trend: 'rising'
      },
      {
        keyword: `${query} tips`,
        searchVolume: 1600,
        difficulty: 22,
        cpc: 1.2,
        trend: 'stable'
      },
      {
        keyword: `best ${query}`,
        searchVolume: 3200,
        difficulty: 51,
        cpc: 3.5,
        trend: 'rising'
      },
      {
        keyword: `${query} 2024`,
        searchVolume: 1900,
        difficulty: 35,
        cpc: 2.1,
        trend: 'rising'
      }
    ];

    res.json(keywords.slice(0, Number(limit)));
  } catch (err) {
    logger.error('Research keywords error:', err);
    res.status(500).json({ error: 'Failed to research keywords' });
  }
};

export const getTrackedKeywords = async (req: Request, res: Response) => {
  try {
    const { websiteId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = ((Number(page) - 1) * Number(limit));

    const result = await pool.query(
      `SELECT * FROM keywords WHERE website_id = $1 
       ORDER BY search_volume DESC
       LIMIT $2 OFFSET $3`,
      [websiteId, Number(limit), offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM keywords WHERE website_id = $1`,
      [websiteId]
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    logger.error('Get tracked keywords error:', err);
    res.status(500).json({ error: 'Failed to get tracked keywords' });
  }
};

export const trackKeyword = async (req: Request, res: Response) => {
  try {
    const { websiteId } = req.params;
    const { keyword, url } = req.body;

    if (!keyword || !url) {
      return res.status(400).json({ error: 'keyword and url are required' });
    }

    const result = await pool.query(
      `INSERT INTO keywords (website_id, keyword, url, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [websiteId, keyword, url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error('Track keyword error:', err);
    res.status(500).json({ error: 'Failed to track keyword' });
  }
};

export const getRankingHistory = async (req: Request, res: Response) => {
  try {
    const { keywordId } = req.params;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT * FROM keyword_rankings 
       WHERE keyword_id = $1 AND checked_at >= NOW() - INTERVAL '${days} days'
       ORDER BY checked_at DESC`,
      [keywordId]
    );

    res.json(result.rows);
  } catch (err) {
    logger.error('Get ranking history error:', err);
    res.status(500).json({ error: 'Failed to get ranking history' });
  }
};
