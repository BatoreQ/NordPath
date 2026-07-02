import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

export const examsRouter = Router();

examsRouter.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('teacher_id', req.teacherId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

examsRouter.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title jest wymagany' });

  const { data, error } = await supabase
    .from('exams')
    .insert({ title, teacher_id: req.teacherId })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

examsRouter.get('/:examId', async (req, res) => {
  const { data, error } = await supabase
    .from('exams')
    .select('*, questions(*)')
    .eq('id', req.params.examId)
    .eq('teacher_id', req.teacherId)
    .single();
  if (error) return res.status(404).json({ error: 'Egzamin nie znaleziony' });
  res.json(data);
});

examsRouter.delete('/:examId', async (req, res) => {
  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', req.params.examId)
    .eq('teacher_id', req.teacherId);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

examsRouter.get('/:examId/report.csv', async (req, res) => {
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('title')
    .eq('id', req.params.examId)
    .eq('teacher_id', req.teacherId)
    .single();
  if (examError) return res.status(404).json({ error: 'Egzamin nie znaleziony' });

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, question_number, max_points')
    .eq('exam_id', req.params.examId)
    .order('question_number');
  if (qError) return res.status(500).json({ error: qError.message });

  const { data: submissions, error: sError } = await supabase
    .from('student_submissions')
    .select('student_identifier, total_score, status, submission_answers(question_id, final_score, suggested_score)')
    .eq('exam_id', req.params.examId)
    .order('student_identifier');
  if (sError) return res.status(500).json({ error: sError.message });

  const escapeCsv = (value) => {
    const str = String(value ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const header = ['uczen', ...questions.map((q) => `pyt_${q.question_number}`), 'suma', 'status'];
  const lines = [header.map(escapeCsv).join(',')];

  for (const submission of submissions) {
    const scoresByQuestion = new Map(
      submission.submission_answers.map((a) => [a.question_id, a.final_score ?? a.suggested_score ?? ''])
    );
    const row = [
      submission.student_identifier ?? '(anonimowy)',
      ...questions.map((q) => scoresByQuestion.get(q.id) ?? ''),
      submission.total_score ?? '',
      submission.status,
    ];
    lines.push(row.map(escapeCsv).join(','));
  }

  const csv = '﻿' + lines.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="raport-${exam.title.replace(/[^a-z0-9]+/gi, '_')}.csv"`
  );
  res.send(csv);
});
