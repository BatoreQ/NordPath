import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { supabase } from '../lib/supabase.js';
import { assertExamOwnership, assertSubmissionOwnership } from '../lib/ownership.js';
import { gradeSubmissionImage } from '../lib/claude.js';

export const submissionsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const STORAGE_BUCKET = 'submission-scans';

submissionsRouter.get('/', async (req, res) => {
  const { exam_id } = req.query;
  if (!exam_id) return res.status(400).json({ error: 'exam_id jest wymagany' });
  if (!(await assertExamOwnership(exam_id, req.teacherId))) {
    return res.status(404).json({ error: 'Egzamin nie znaleziony' });
  }

  const { data, error } = await supabase
    .from('student_submissions')
    .select('*')
    .eq('exam_id', exam_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

submissionsRouter.get('/:submissionId', async (req, res) => {
  if (!(await assertSubmissionOwnership(req.params.submissionId, req.teacherId))) {
    return res.status(404).json({ error: 'Praca nie znaleziona' });
  }
  const { data, error } = await supabase
    .from('student_submissions')
    .select('*, submission_answers(*, questions(*))')
    .eq('id', req.params.submissionId)
    .single();
  if (error) return res.status(404).json({ error: 'Praca nie znaleziona' });
  res.json(data);
});

submissionsRouter.get('/:submissionId/images', async (req, res) => {
  if (!(await assertSubmissionOwnership(req.params.submissionId, req.teacherId))) {
    return res.status(404).json({ error: 'Praca nie znaleziona' });
  }
  const { data: submission, error } = await supabase
    .from('student_submissions')
    .select('image_urls')
    .eq('id', req.params.submissionId)
    .single();
  if (error) return res.status(404).json({ error: 'Praca nie znaleziona' });

  const { data: signed, error: signError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrls(submission.image_urls, 60 * 10);
  if (signError) return res.status(500).json({ error: signError.message });
  res.json(signed.map((s) => s.signedUrl));
});

// Jedno zdjęcie na kartkę — nauczyciel może wywołać ten endpoint wielokrotnie
// dla kolejnych stron tej samej pracy.
submissionsRouter.post('/', upload.single('image'), async (req, res) => {
  const { exam_id, student_identifier } = req.body;
  if (!exam_id || !req.file) {
    return res.status(400).json({ error: 'exam_id i plik image są wymagane' });
  }
  if (!(await assertExamOwnership(exam_id, req.teacherId))) {
    return res.status(404).json({ error: 'Egzamin nie znaleziony' });
  }

  const ext = (req.file.mimetype.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `${req.teacherId}/${exam_id}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, req.file.buffer, { contentType: req.file.mimetype });
  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data, error } = await supabase
    .from('student_submissions')
    .insert({
      exam_id,
      student_identifier: student_identifier ?? null,
      image_urls: [path],
      status: 'pending',
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

submissionsRouter.post('/:submissionId/pages', upload.single('image'), async (req, res) => {
  if (!(await assertSubmissionOwnership(req.params.submissionId, req.teacherId))) {
    return res.status(404).json({ error: 'Praca nie znaleziona' });
  }
  if (!req.file) return res.status(400).json({ error: 'Plik image jest wymagany' });

  const { data: submission, error: fetchError } = await supabase
    .from('student_submissions')
    .select('exam_id, image_urls')
    .eq('id', req.params.submissionId)
    .single();
  if (fetchError) return res.status(404).json({ error: 'Praca nie znaleziona' });

  const ext = (req.file.mimetype.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `${req.teacherId}/${submission.exam_id}/${randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, req.file.buffer, { contentType: req.file.mimetype });
  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data, error } = await supabase
    .from('student_submissions')
    .update({ image_urls: [...submission.image_urls, path] })
    .eq('id', req.params.submissionId)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Wywołuje Claude na wszystkich stronach pracy i zapisuje rozpoznane odpowiedzi.
submissionsRouter.post('/:submissionId/grade', async (req, res) => {
  if (!(await assertSubmissionOwnership(req.params.submissionId, req.teacherId))) {
    return res.status(404).json({ error: 'Praca nie znaleziona' });
  }

  const { data: submission, error: subError } = await supabase
    .from('student_submissions')
    .select('*, exams(id)')
    .eq('id', req.params.submissionId)
    .single();
  if (subError) return res.status(404).json({ error: 'Praca nie znaleziona' });

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', submission.exam_id)
    .order('question_number');
  if (qError) return res.status(500).json({ error: qError.message });
  if (!questions.length) {
    return res.status(400).json({ error: 'Egzamin nie ma zdefiniowanych pytań' });
  }

  try {
    const allAnswers = new Map();
    for (const path of submission.image_urls) {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(path);
      if (downloadError) throw new Error(downloadError.message);

      const arrayBuffer = await fileBlob.arrayBuffer();
      const imageBase64 = Buffer.from(arrayBuffer).toString('base64');
      const mediaType = fileBlob.type || 'image/jpeg';

      const answers = await gradeSubmissionImage({ imageBase64, mediaType, questions });
      for (const answer of answers) {
        // Kolejne strony mogą zawierać ten sam numer pytania (nierozpoznane na
        // pierwszej stronie) — nowsza, niepusta odpowiedź nadpisuje starszą.
        const existing = allAnswers.get(answer.question_number);
        if (!existing || answer.recognized_text || answer.recognized_answer) {
          allAnswers.set(answer.question_number, answer);
        }
      }
    }

    const questionByNumber = new Map(questions.map((q) => [q.question_number, q]));
    const rows = [...allAnswers.values()].map((answer) => {
      const question = questionByNumber.get(answer.question_number);
      return {
        submission_id: submission.id,
        question_id: question.id,
        recognized_text: answer.recognized_text ?? answer.recognized_answer ?? null,
        is_correct: answer.type === 'closed' ? answer.is_correct : null,
        suggested_score:
          answer.type === 'closed'
            ? answer.is_correct
              ? question.max_points
              : 0
            : answer.suggested_score,
        ai_reasoning: answer.reasoning ?? null,
        teacher_reviewed: false,
      };
    });

    const { error: upsertError } = await supabase
      .from('submission_answers')
      .upsert(rows, { onConflict: 'submission_id,question_id' });
    if (upsertError) throw new Error(upsertError.message);

    const totalScore = rows.reduce((sum, r) => sum + (r.suggested_score ?? 0), 0);
    const { data: updated, error: updateError } = await supabase
      .from('student_submissions')
      .update({ status: 'processed', total_score: totalScore })
      .eq('id', submission.id)
      .select('*, submission_answers(*, questions(*))')
      .single();
    if (updateError) throw new Error(updateError.message);

    res.json(updated);
  } catch (err) {
    res.status(502).json({ error: `Błąd rozpoznawania Claude: ${err.message}` });
  }
});

// Nauczyciel zatwierdza lub koryguje sugestię AI dla jednego pytania.
submissionsRouter.patch('/:submissionId/answers/:answerId', async (req, res) => {
  if (!(await assertSubmissionOwnership(req.params.submissionId, req.teacherId))) {
    return res.status(404).json({ error: 'Praca nie znaleziona' });
  }
  const { final_score } = req.body;
  if (typeof final_score !== 'number') {
    return res.status(400).json({ error: 'final_score (number) jest wymagany' });
  }

  const { error: answerError } = await supabase
    .from('submission_answers')
    .update({ final_score, teacher_reviewed: true })
    .eq('id', req.params.answerId)
    .eq('submission_id', req.params.submissionId);
  if (answerError) return res.status(500).json({ error: answerError.message });

  const { data: answers, error: listError } = await supabase
    .from('submission_answers')
    .select('final_score, suggested_score')
    .eq('submission_id', req.params.submissionId);
  if (listError) return res.status(500).json({ error: listError.message });

  const allReviewed = await supabase
    .from('submission_answers')
    .select('teacher_reviewed')
    .eq('submission_id', req.params.submissionId);
  const fullyReviewed = allReviewed.data?.every((a) => a.teacher_reviewed) ?? false;

  const totalScore = answers.reduce((sum, a) => sum + (a.final_score ?? a.suggested_score ?? 0), 0);
  const { data: updated, error: updateError } = await supabase
    .from('student_submissions')
    .update({ total_score: totalScore, status: fullyReviewed ? 'reviewed' : 'processed' })
    .eq('id', req.params.submissionId)
    .select('*, submission_answers(*, questions(*))')
    .single();
  if (updateError) return res.status(500).json({ error: updateError.message });
  res.json(updated);
});
