import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ── Storage location: /backend/uploads/docs ──────────────────────────────────
const DOCS_DIR = path.join(process.cwd(), 'uploads', 'docs');
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DOCS_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique   = `${Date.now()}-${safeName}`;
    cb(null, unique);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

export const pdfUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB cap
});

export class DocumentController {
  // POST /api/documents/upload
  static async uploadDocument(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ error: 'No PDF file uploaded' });
      return;
    }

    const API_URL = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url     = `${API_URL}/docs/${req.file.filename}`;

    res.json({ success: true, url, filename: req.file.filename });
  }

  // DELETE /api/documents/upload
  static async deleteDocument(req: Request, res: Response): Promise<void> {
    const { filename } = req.body as { filename?: string };
    if (!filename) {
      res.status(400).json({ error: 'filename required' });
      return;
    }

    // Sanitize: do NOT allow directory traversal
    const safe = path.basename(filename);
    const filePath = path.join(DOCS_DIR, safe);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Delete document error:', err);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  }
}
