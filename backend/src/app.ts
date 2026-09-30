import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { apiRouter } from './routes';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', apiRouter);
