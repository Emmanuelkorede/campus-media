import { BrowserRouter, Routes, Route, Navigate } from "react-router";

// ── Providers ─────────────────────────────────
import { AuthProvider }  from "./context/AuthContext";
import { QuizProvider }  from "./context/QuizContext";

// ── Route guards ──────────────────────────────
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

// ── Student pages ─────────────────────────────
import Landing      from "./pages/Landing";
import Login        from "./pages/Login";
import StreamSelect from "./pages/StreamSelect";
import TestSetup    from "./pages/TestSetup";
import Quiz         from "./pages/Quiz";
import Results      from "./pages/Results";

// ── Admin pages ───────────────────────────────
import AdminLogin     from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// ─────────────────────────────────────────────
//  APP
//
//  Provider nesting order (outermost → innermost):
//    BrowserRouter           – gives all components access to routing
//      AuthProvider          – user session, login, logout, stream
//        QuizProvider        – active test state, questions, answers, timer
//          Routes            – all page routes
//
//  Route protection:
//    /stream  /setup  /quiz  /results  → ProtectedRoute (must be logged in)
//    /setup   /quiz   /results         → ProtectedRoute + requireStream
//    /admin/dashboard                  → AdminRoute (must be admin)
// ─────────────────────────────────────────────

export default function App() {
  return (
    
      <AuthProvider>
        <QuizProvider>
          <Routes>

            {/* ── Public routes ──────────────── */}
            <Route path="/"      element={<Landing />} />
            <Route path="/login" element={<Login />}   />

            {/* ── Student routes ─────────────── */}

            {/* Stream select: must be logged in */}
            <Route
              path="/stream"
              element={
                <ProtectedRoute>
                  <StreamSelect />
                </ProtectedRoute>
              }
            />

            {/* Test setup: must be logged in + have a stream */}
            <Route
              path="/setup"
              element={
                <ProtectedRoute requireStream>
                  <TestSetup />
                </ProtectedRoute>
              }
            />

            {/* Active quiz: must be logged in + have a stream */}
            <Route
              path="/quiz"
              element={
                <ProtectedRoute requireStream>
                  <Quiz />
                </ProtectedRoute>
              }
            />

            {/* Results: must be logged in + have a stream */}
            <Route
              path="/results"
              element={
                <ProtectedRoute requireStream>
                  <Results />
                </ProtectedRoute>
              }
            />

            {/* ── Admin routes ───────────────── */}

            {/* Admin login: public (guards inside AdminLogin itself) */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Admin dashboard: must be logged in as admin */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* ── Catch-all → home ───────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </QuizProvider>
      </AuthProvider>
    
  );
}

