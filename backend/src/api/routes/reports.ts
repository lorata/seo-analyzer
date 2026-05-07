import express from 'express';
import { generateReport, getReport, downloadReport, listReports } from '../controllers/reportController';

const router = express.Router();

router.post('/generate', generateReport);
router.get('/:reportId', getReport);
router.get('/:reportId/download', downloadReport);
router.get('/audit/:auditId', listReports);

export default router;
