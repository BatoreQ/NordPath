import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function refresh() {
    setLoading(true);
    api
      .listExams()
      .then(setExams)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.createExam(title.trim());
      setTitle('');
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(examId) {
    if (!confirm('Usunąć ten egzamin razem z pytaniami i pracami uczniów?')) return;
    try {
      await api.deleteExam(examId);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <h1>Twoje egzaminy</h1>
      <form className="inline-form" onSubmit={handleCreate}>
        <input
          placeholder="Nazwa egzaminu, np. Kartkówka z historii kl. 7"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Utwórz egzamin</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Ładowanie…</p>
      ) : exams.length === 0 ? (
        <p className="empty-state">Brak egzaminów. Utwórz pierwszy powyżej.</p>
      ) : (
        <ul className="exam-list">
          {exams.map((exam) => (
            <li key={exam.id} className="exam-list-item">
              <div>
                <Link to={`/exams/${exam.id}`}>{exam.title}</Link>
                <span className="muted"> — utworzono {new Date(exam.created_at).toLocaleDateString('pl-PL')}</span>
              </div>
              <div className="exam-list-actions">
                <Link to={`/exams/${exam.id}/scan`}>Skanuj prace</Link>
                <Link to={`/exams/${exam.id}/review`}>Weryfikacja</Link>
                <button className="link-button danger" onClick={() => handleDelete(exam.id)}>
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
