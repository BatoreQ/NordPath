import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = { ...(options.headers || {}) };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  if (!(options.body instanceof FormData) && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      // brak treści JSON w odpowiedzi błędu
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listExams: () => request('/api/exams'),
  createExam: (title) => request('/api/exams', { method: 'POST', body: JSON.stringify({ title }) }),
  getExam: (examId) => request(`/api/exams/${examId}`),
  deleteExam: (examId) => request(`/api/exams/${examId}`, { method: 'DELETE' }),
  downloadReportCsv: async (examId) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch(`${API_URL}/api/exams/${examId}/report.csv`, {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (!res.ok) throw new Error('Nie udało się pobrać raportu');
    return res.blob();
  },

  createQuestion: (payload) =>
    request('/api/questions', { method: 'POST', body: JSON.stringify(payload) }),
  updateQuestion: (questionId, payload) =>
    request(`/api/questions/${questionId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteQuestion: (questionId) => request(`/api/questions/${questionId}`, { method: 'DELETE' }),

  listSubmissions: (examId) => request(`/api/submissions?exam_id=${examId}`),
  getSubmission: (submissionId) => request(`/api/submissions/${submissionId}`),
  getSubmissionImages: (submissionId) => request(`/api/submissions/${submissionId}/images`),
  createSubmission: (examId, studentIdentifier, imageFile) => {
    const form = new FormData();
    form.append('exam_id', examId);
    if (studentIdentifier) form.append('student_identifier', studentIdentifier);
    form.append('image', imageFile);
    return request('/api/submissions', { method: 'POST', body: form });
  },
  addSubmissionPage: (submissionId, imageFile) => {
    const form = new FormData();
    form.append('image', imageFile);
    return request(`/api/submissions/${submissionId}/pages`, { method: 'POST', body: form });
  },
  gradeSubmission: (submissionId) =>
    request(`/api/submissions/${submissionId}/grade`, { method: 'POST' }),
  reviewAnswer: (submissionId, answerId, finalScore) =>
    request(`/api/submissions/${submissionId}/answers/${answerId}`, {
      method: 'PATCH',
      body: JSON.stringify({ final_score: finalScore }),
    }),
};
