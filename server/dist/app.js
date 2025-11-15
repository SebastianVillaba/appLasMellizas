import express from 'express';
import cors from 'cors';
import routes from './routes.js';
const app = express();
app.use(cors());
app.use(express.json());
// Health check
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// API routes
app.use('/api', routes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Recurso no encontrado' });
});
export default app;
//# sourceMappingURL=app.js.map