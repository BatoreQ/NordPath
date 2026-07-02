import { supabase } from './supabase.js';

// Service role key bypasses RLS, so ownership must be checked explicitly here
// before any mutation scoped to an exam_id / submission_id.
export async function assertExamOwnership(examId, teacherId) {
  const { data, error } = await supabase
    .from('exams')
    .select('id')
    .eq('id', examId)
    .eq('teacher_id', teacherId)
    .maybeSingle();
  if (error || !data) return false;
  return true;
}

export async function assertSubmissionOwnership(submissionId, teacherId) {
  const { data, error } = await supabase
    .from('student_submissions')
    .select('id, exams!inner(teacher_id)')
    .eq('id', submissionId)
    .eq('exams.teacher_id', teacherId)
    .maybeSingle();
  if (error || !data) return false;
  return true;
}
