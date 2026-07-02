import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

const STATUS_LABELS = {
  pending: 'Oczekuje na skanowanie',
  processed: 'Do weryfikacji',
  reviewed: 'Zweryfikowane',
};

const STATUS_PRIORITY = { processed: 0, pending: 1, reviewed: 2 };

export default function ReviewPanel() {
  const { examId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.listSubmissions(examId), api.getExam(examId)])
      .then(([subs, examData]) => {
        setSubmissions(subs);
        setExam(examData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [examId]);

  const sorted = [...submissions].sort(
    (a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9)
  );

  async function handleDownloadReport() {
    try {
      const blob = await api.downloadReportCsv(examId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `raport-${exam?.title || 'egzamin'}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/exams/${examId}`}>← Wróć do egzaminu</Link>
      </p>
      <div className="page-header-row">
        <h1>Panel weryfikacji{exam ? ` — ${exam.title}` : ''}</h1>
        <button onClick={handleDownloadReport} disabled={sorted.length === 0}>
          Pobierz raport CSV
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Ładowanie…</p>
      ) : sorted.length === 0 ? (
        <p className="empty-state">Brak zeskanowanych prac. Przejdź do skanowania, aby dodać pierwszą.</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Uczeń</th>
              <th>Status</th>
              <th>Suma punktów</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className={`status-${s.status}`}>
                <td>{s.student_identifier || '(anonimowa)'}</td>
                <td>
                  <span className={`status-badge status-badge-${s.status}`}>{STATUS_LABELS[s.status]}</span>
                </td>
                <td>{s.total_score ?? '—'}</td>
                <td>
                  <Link to={`/submissions/${s.id}`}>Otwórz</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
