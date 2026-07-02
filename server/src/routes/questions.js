import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { assertExamOwnership } from '../lib/ownership.js';

export const questionsRouter = Router();

questionsRouter.post('/', async (req, res) => {
  const { exam_id, question_number, type, correct_answer, model_answer, max_points, grading_criteria } =
    req.body;

  if (!exam_id || !question_number || !type) {
    return res.status(400).json({ error: 'exam_id, question_number i type są wymagane' });
  }
  if (!(await assertExamOwnership(exam_id, req.teacherId))) {
    return res.status(404).json({ error: 'Egzamin nie znaleziony' });
  }

  const { data, error } = await supabase
    .from('questions')
    .insert({
      exam_id,
      question_number,
      type,
      correct_answer: type === 'closed' ? correct_answer : null,
      model_answer: type === 'open' ? model_answer : null,
      max_points: max_points ?? 1,
      grading_criteria: grading_criteria ?? null,
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

questionsRouter.put('/:questionId', async (req, res) => {
  const { data: question } = await supabase
    .from('questions')
    .select('exam_id')
    .eq('id', req.params.questionId)
    .single();
  if (!question || !(await assertExamOwnership(question.exam_id, req.teacherId))) {
    return res.status(404).json({ error: 'Pytanie nie znalezione' });
  }

  const { correct_answer, model_answer, max_points, grading_criteria } = req.body;
  const { data, error } = await supabase
    .from('questions')
    .update({ correct_answer, model_answer, max_points, grading_criteria })
    .eq('id', req.params.questionId)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

questionsRouter.delete('/:questionId', async (req, res) => {
  const { data: question } = await supabase
    .from('questions')
    .select('exam_id')
    .eq('id', req.params.questionId)
    .single();
  if (!question || !(await assertExamOwnership(question.exam_id, req.teacherId))) {
    return res.status(404).json({ error: 'Pytanie nie znalezione' });
  }

  const { error } = await supabase.from('questions').delete().eq('id', req.params.questionId);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});
