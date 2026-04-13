// TODO
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────
//  PROTECTED ROUTE
//  Wraps any student-only page.
//  If the user is not logged in → redirect to /login.
//  If logged in but has no stream selected yet → redirect to /stream.
//
//  Usage in App.jsx:
//    <Route path="/setup" element={
//      <ProtectedRoute requireStream>
//        <TestSetup />
//      </ProtectedRoute>
//    } />
//
//  Props:
//    children       – the page component to render
//    requireStream  – bool, also checks stream is set (default false)
// ─────────────────────────────────────────────
export function ProtectedRoute({ children, requireStream = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ── While auth is resolving show nothing ──
  // (prevents flash-redirect on page refresh)
  if (loading) {
    return <LoadingScreen />;
  }

  // ── Not logged in → go to login ───────────
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}  // so Login can redirect back after success
        replace
      />
    );
  }

  // ── Logged in but no stream chosen yet ────
  if (requireStream && !user.stream) {
    return <Navigate to="/stream" replace />;
  }

  return children;
}

// ─────────────────────────────────────────────
//  ADMIN ROUTE
//  Wraps every /admin/* page.
//  If not logged in            → /admin (login page)
//  If logged in but not admin  → / (home, silent redirect)
//  If admin                    → render the page
//
//  Usage in App.jsx:
//    <Route path="/admin/dashboard" element={
//      <AdminRoute>
//        <AdminDashboard />
//      </AdminRoute>
//    } />
// ─────────────────────────────────────────────
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  // Not logged in at all → back to admin login
  if (!user) {
    return (
      <Navigate
        to="/admin"
        state={{ from: location }}
        replace
      />
    );
  }

  // Logged in but not an admin → silently redirect home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// ─────────────────────────────────────────────
//  LOADING SCREEN
//  Shown while AuthContext is resolving the
//  user from Supabase on first load.
//  Internal to this file — not exported.
// ─────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center
                    bg-gray-50 gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 rounded-full border-4 border-teal-200
                      border-t-teal-500 animate-spin" />
      <p className="text-sm text-gray-400 font-semibold tracking-wide">
        Loading…
      </p>
    </div>
  );
}