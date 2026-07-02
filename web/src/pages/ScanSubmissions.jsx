import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function ScanSubmissions() {
  const { examId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [capturedPages, setCapturedPages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [recentlyGraded, setRecentlyGraded] = useState([]);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
      })
      .catch((err) => setCameraError(err.message));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92));
  }

  async function handleCaptureClick() {
    const blob = await captureFrame();
    if (!blob) return;
    await handleNewPage(new File([blob], `strona-${Date.now()}.jpg`, { type: 'image/jpeg' }));
  }

  async function handleFileInput(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await handleNewPage(file);
  }

  async function handleNewPage(file) {
    setBusy(true);
    setError('');
    try {
      if (!activeSubmission) {
        const submission = await api.createSubmission(examId, studentIdentifier.trim() || null, file);
        setActiveSubmission(submission);
        setCapturedPages([file]);
      } else {
        await api.addSubmissionPage(activeSubmission.id, file);
        setCapturedPages((pages) => [...pages, file]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleFinishStudent() {
    if (!activeSubmission) return;
    setBusy(true);
    setError('');
    try {
      const graded = await api.gradeSubmission(activeSubmission.id);
      setRecentlyGraded((list) => [graded, ...list].slice(0, 5));
      setActiveSubmission(null);
      setCapturedPages([]);
      setStudentIdentifier('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/exams/${examId}`}>← Wróć do egzaminu</Link>
      </p>
      <h1>Skanowanie prac</h1>
      <p className="muted">
        Połóż kartkę pod kamerą i zrób zdjęcie. Kolejne kliknięcia dodają kolejne strony tej samej pracy —
        kliknij „Zakończ pracę ucznia”, gdy wszystkie strony są gotowe.
      </p>

      <label className="student-id-field">
        Numer w dzienniku / identyfikator ucznia (opcjonalnie)
        <input
          disabled={!!activeSubmission}
          value={studentIdentifier}
          onChange={(e) => setStudentIdentifier(e.target.value)}
          placeholder="np. 14"
        />
      </label>

      <div className="camera-stage">
        {cameraError ? (
          <p className="error-text">Brak dostępu do kamery: {cameraError}. Użyj przycisku poniżej, aby wgrać zdjęcie.</p>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="camera-preview" />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="camera-actions">
          <button onClick={handleCaptureClick} disabled={!cameraReady || busy}>
            📸 Zrób zdjęcie kartki
          </button>
          <label className="file-fallback-button">
            Wgraj zdjęcie
            <input type="file" accept="image/*" capture="environment" onChange={handleFileInput} hidden />
          </label>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {activeSubmission && (
        <div className="active-submission-card">
          <h3>
            Bieżąca praca: {activeSubmission.student_identifier || '(anonimowa)'} — {capturedPages.length}{' '}
            {capturedPages.length === 1 ? 'strona' : 'strony'}
          </h3>
          <div className="page-thumbnails">
            {capturedPages.map((file, i) => (
              <img key={i} src={URL.createObjectURL(file)} alt={`strona ${i + 1}`} />
            ))}
          </div>
          <button onClick={handleFinishStudent} disabled={busy}>
            {busy ? 'Przetwarzanie…' : 'Zakończ pracę ucznia i oceń (Claude)'}
          </button>
        </div>
      )}

      {recentlyGraded.length > 0 && (
        <div className="recently-graded">
          <h3>Ostatnio ocenione</h3>
          <ul>
            {recentlyGraded.map((s) => (
              <li key={s.id}>
                {s.student_identifier || '(anonimowa)'} — {s.total_score ?? '—'} pkt
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
