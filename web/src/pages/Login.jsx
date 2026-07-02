import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signInWithPassword, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setInfo('Konto utworzone. Sprawdź e-mail, aby potwierdzić rejestrację, a następnie zaloguj się.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>NordPath</h1>
        <p className="subtitle">Asystent sprawdzania egzaminów</p>
        <label>
          E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Hasło
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        {info && <p className="info-text">{info}</p>}
        <button type="submit" disabled={busy}>
          {mode === 'signin' ? 'Zaloguj się' : 'Utwórz konto'}
        </button>
        <button
          type="button"
          className="link-button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
        </button>
      </form>
    </div>
  );
}
