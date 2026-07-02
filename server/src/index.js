import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { requireTeacher } from './lib/auth.js';
import { examsRouter } from './routes/exams.js';
import { questionsRouter } from './routes/questions.js';
import { submissionsRouter } from './routes/submissions.js';

const app = express();
const PORT = process.env.PORT || 8787;
const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/exams', requireTeacher, examsRouter);
app.use('/api/questions', requireTeacher, questionsRouter);
app.use('/api/submissions', requireTeacher, submissionsRouter);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Nieoczekiwany błąd serwera' });
});

app.listen(PORT, () => {
  console.log(`NordPath API nasłuchuje na porcie ${PORT}`);
});
