import express from 'express';
import { createWebsite, getWebsite, listWebsites, updateWebsite, deleteWebsite } from '../controllers/websiteController';

const router = express.Router();

router.post('/', createWebsite);
router.get('/', listWebsites);
router.get('/:id', getWebsite);
router.put('/:id', updateWebsite);
router.delete('/:id', deleteWebsite);

export default router;
