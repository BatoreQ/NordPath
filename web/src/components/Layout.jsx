import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { session, signOut } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          NordPath
        </Link>
        {session && (
          <div className="header-actions">
            <span className="user-email">{session.user.email}</span>
            <button className="link-button" onClick={() => signOut()}>
              Wyloguj
            </button>
          </div>
        )}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
