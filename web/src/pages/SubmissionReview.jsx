import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function SubmissionReview() {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [scoreDrafts, setScoreDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  function refresh() {
    api
      .getSubmission(submissionId)
      .then((data) => {
        setSubmission(data);
        const drafts = {};
        for (const a of data.submission_answers) {
          drafts[a.id] = a.final_score ?? a.suggested_score ?? 0;
        }
        setScoreDrafts(drafts);
      })
      .catch((err) => setError(err.message));
    api
      .getSubmissionImages(submissionId)
      .then(setImages)
      .catch(() => {});
  }

  useEffect(refresh, [submissionId]);

  async function handleSaveScore(answerId) {
    setSavingId(answerId);
    setError('');
    try {
      const updated = await api.reviewAnswer(submissionId, answerId, Number(scoreDrafts[answerId]));
      setSubmission(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  if (!submission) return <div className="page">{error ? <p className="error-text">{error}</p> : 'Ładowanie…'}</div>;

  const answers = [...submission.submission_answers].sort(
    (a, b) => a.questions.question_number - b.questions.question_number
  );

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/exams/${submission.exam_id}/review`}>← Wróć do panelu weryfikacji</Link>
      </p>
      <h1>{submission.student_identifier || '(anonimowa praca)'}</h1>
      <p className="muted">Suma punktów: {submission.total_score ?? '—'}</p>

      {images.length > 0 && (
        <div className="page-thumbnails">
          {images.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noreferrer">
              <img src={url} alt={`strona ${i + 1}`} />
            </a>
          ))}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="answer-list">
        {answers.map((a) => (
          <div key={a.id} className={`answer-card ${a.teacher_reviewed ? 'reviewed' : ''}`}>
            <div className="answer-card-header">
              <strong>Pytanie {a.questions.question_number}</strong>
              <span className="muted">{a.questions.type === 'closed' ? 'Zamknięte' : 'Otwarte'}</span>
              {a.questions.type === 'closed' && (
                <span className={a.is_correct ? 'status-badge status-badge-reviewed' : 'status-badge status-badge-pending'}>
                  {a.is_correct ? 'Poprawna' : 'Błędna'}
                </span>
              )}
            </div>
            <p>
              <span className="muted">Odczytana odpowiedź: </span>
              {a.recognized_text || '(brak)'}
            </p>
            {a.questions.type === 'open' && (
              <p className="ai-reasoning">
                <span className="muted">Uzasadnienie AI: </span>
                {a.ai_reasoning || '—'}
              </p>
            )}
            <div className="score-row">
              <label>
                Punkty (maks. {a.questions.max_points})
                <input
                  type="number"
                  min="0"
                  max={a.questions.max_points}
                  step="0.5"
                  value={scoreDrafts[a.id] ?? 0}
                  onChange={(e) => setScoreDrafts({ ...scoreDrafts, [a.id]: e.target.value })}
                />
              </label>
              <button disabled={savingId === a.id} onClick={() => handleSaveScore(a.id)}>
                {a.teacher_reviewed ? 'Zapisano ✓' : savingId === a.id ? 'Zapisywanie…' : 'Zatwierdź'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
