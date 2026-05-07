import express from 'express';
import { startAudit, getAudit, getAuditIssues, getAuditReport } from '../controllers/auditController';

const router = express.Router();

router.post('/start', startAudit);
router.get('/:auditId', getAudit);
router.get('/:auditId/issues', getAuditIssues);
router.get('/:auditId/report', getAuditReport);

export default router;
