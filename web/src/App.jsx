import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import ExamList from './pages/ExamList';
import ExamSetup from './pages/ExamSetup';
import ScanSubmissions from './pages/ScanSubmissions';
import ReviewPanel from './pages/ReviewPanel';
import SubmissionReview from './pages/SubmissionReview';

function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="page">Ładowanie…</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<ExamList />} />
        <Route path="/exams/:examId" element={<ExamSetup />} />
        <Route path="/exams/:examId/scan" element={<ScanSubmissions />} />
        <Route path="/exams/:examId/review" element={<ReviewPanel />} />
        <Route path="/submissions/:submissionId" element={<SubmissionReview />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
