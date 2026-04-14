// TODO
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";


export function ProtectedRoute({ children, requireStream = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  
  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}  
        replace
      />
    );
  }

  if (requireStream && !user.stream) {
    return <Navigate to="/stream" replace />;
  }

  return children;
}


export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/admin"
        state={{ from: location }}
        replace
      />
    );
  }


  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}


function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center
                    bg-gray-50 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-teal-200
                      border-t-teal-500 animate-spin" />
      <p className="text-sm text-gray-400 font-semibold tracking-wide">
        Loading…
      </p>
    </div>
  );
}