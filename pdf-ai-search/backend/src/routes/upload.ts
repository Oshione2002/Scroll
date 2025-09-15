import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { hashBuffer } from '../utils/pdfUtils';
import { buildIndex } from '../rag/indexBuilder';

const upload = multer();
const router = express.Router();

router.post('/', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || !(req.files instanceof Array)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const buffers = (req.files as Express.Multer.File[]).map((f) => ({ name: f.originalname, buffer: f.buffer }));
    const hash = hashBuffer(Buffer.concat(buffers.map((b) => b.buffer)));
    const dir = path.join('storage', hash);
    await buildIndex(buffers, dir);
    fs.writeFileSync(path.join('storage', 'current'), hash);
    res.json({ hash });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
