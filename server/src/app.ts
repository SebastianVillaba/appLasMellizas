import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';

import routes from './routes.js';

const app = express();

app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' })); 
app.use(express.json());

// Health check
app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});


export default app;