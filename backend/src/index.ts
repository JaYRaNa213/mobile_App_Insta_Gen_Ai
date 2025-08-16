import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';
import mongoose from 'mongoose';
import uploadRouter from './routes/upload';
import mediaRouter from './routes/media';

const app = express();

// --- Config ---
const PORT = Number(process.env.PORT || 5000);
const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB || 50);

// --- Middlewares ---
app.use(cors());
app.use(express.json({ limit: `${MAX_UPLOAD_SIZE_MB}mb` }));
app.use(morgan('dev'));

// --- DB ---
(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[WARN] MONGODB_URI not set. The server will still start but DB ops will fail.');
  } else {
    await mongoose.connect(uri);
    console.log('[DB] Connected to MongoDB');
  }
})().catch(err => {
  console.error('[DB] Connection error:', err);
});

// --- Routes ---
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use('/', uploadRouter);
app.use('/media', mediaRouter);

// --- 404 ---
app.use((_req, _res, next) => next(createError(404, 'Not Found')));

// --- Error handler ---
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  const msg = err.message || 'Server Error';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: msg });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`[Server] Listening on http://0.0.0.0:${PORT}`);
});
