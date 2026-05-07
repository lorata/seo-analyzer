import express from 'express';
import { researchKeywords, getTrackedKeywords, trackKeyword, getRankingHistory } from '../controllers/keywordController';

const router = express.Router();

router.post('/research', researchKeywords);
router.get('/tracked/:websiteId', getTrackedKeywords);
router.post('/track/:websiteId', trackKeyword);
router.get('/history/:keywordId', getRankingHistory);

export default router;
