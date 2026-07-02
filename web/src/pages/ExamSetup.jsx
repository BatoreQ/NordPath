import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

const emptyQuestion = {
  question_number: '',
  type: 'closed',
  correct_answer: '',
  model_answer: '',
  max_points: 1,
  grading_criteria: '',
};

export default function ExamSetup() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [form, setForm] = useState(emptyQuestion);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function refresh() {
    api.getExam(examId).then(setExam).catch((err) => setError(err.message));
  }

  useEffect(refresh, [examId]);

  useEffect(() => {
    if (exam?.questions?.length) {
      const nextNumber = Math.max(...exam.questions.map((q) => q.question_number)) + 1;
      setForm((f) => ({ ...f, question_number: nextNumber }));
    } else {
      setForm((f) => ({ ...f, question_number: 1 }));
    }
  }, [exam]);

  async function handleAddQuestion(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.createQuestion({
        exam_id: examId,
        question_number: Number(form.question_number),
        type: form.type,
        correct_answer: form.type === 'closed' ? form.correct_answer.toUpperCase() : null,
        model_answer: form.type === 'open' ? form.model_answer : null,
        max_points: Number(form.max_points) || 1,
        grading_criteria: form.grading_criteria || null,
      });
      setForm({ ...emptyQuestion, question_number: Number(form.question_number) + 1 });
      refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuestion(questionId) {
    try {
      await api.deleteQuestion(questionId);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!exam) return <div className="page">{error ? <p className="error-text">{error}</p> : 'Ładowanie…'}</div>;

  const questions = [...exam.questions].sort((a, b) => a.question_number - b.question_number);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">← Wszystkie egzaminy</Link>
      </p>
      <h1>{exam.title}</h1>
      <div className="exam-quick-actions">
        <Link to={`/exams/${examId}/scan`}>Skanuj prace uczniów</Link>
        <Link to={`/exams/${examId}/review`}>Panel weryfikacji</Link>
      </div>

      <h2>Pytania ({questions.length})</h2>
      {questions.length === 0 ? (
        <p className="empty-state">Dodaj pierwsze pytanie poniżej, zanim zaczniesz skanować prace.</p>
      ) : (
        <table className="question-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Typ</th>
              <th>Klucz / wzorzec</th>
              <th>Punkty</th>
              <th>Kryteria</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.question_number}</td>
                <td>{q.type === 'closed' ? 'Zamknięte' : 'Otwarte'}</td>
                <td>{q.type === 'closed' ? q.correct_answer : q.model_answer}</td>
                <td>{q.max_points}</td>
                <td>{q.grading_criteria || '—'}</td>
                <td>
                  <button className="link-button danger" onClick={() => handleDeleteQuestion(q.id)}>
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Dodaj pytanie</h2>
      <form className="question-form" onSubmit={handleAddQuestion}>
        <label>
          Numer pytania
          <input
            type="number"
            min="1"
            required
            value={form.question_number}
            onChange={(e) => setForm({ ...form, question_number: e.target.value })}
          />
        </label>
        <label>
          Typ pytania
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="closed">Zamknięte (a/b/c/d)</option>
            <option value="open">Otwarte</option>
          </select>
        </label>
        {form.type === 'closed' ? (
          <label>
            Poprawna odpowiedź
            <input
              maxLength={1}
              required
              placeholder="np. B"
              value={form.correct_answer}
              onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
            />
          </label>
        ) : (
          <label>
            Wzorcowa odpowiedź
            <textarea
              required
              rows={2}
              value={form.model_answer}
              onChange={(e) => setForm({ ...form, model_answer: e.target.value })}
            />
          </label>
        )}
        <label>
          Maksymalna liczba punktów
          <input
            type="number"
            min="0"
            step="0.5"
            value={form.max_points}
            onChange={(e) => setForm({ ...form, max_points: e.target.value })}
          />
        </label>
        {form.type === 'open' && (
          <label>
            Kryteria punktacji (opcjonalnie)
            <textarea
              rows={2}
              placeholder="np. 1 pkt za wymienienie stolicy, 1 pkt za rok"
              value={form.grading_criteria}
              onChange={(e) => setForm({ ...form, grading_criteria: e.target.value })}
            />
          </label>
        )}
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={saving}>
          Dodaj pytanie
        </button>
      </form>
    </div>
  );
}
