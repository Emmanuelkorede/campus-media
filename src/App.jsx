import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StreamSelect from "./pages/StreamSelect";
import TestSetup from "./pages/TestSetup";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import MainLayout from "./components/MainLayout";
import Feeds from "./pages/Feeds";
import Profile from "./pages/Profile";
import CBTList from "./pages/CBTList";

export default function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />

          <Route element={<MainLayout />}>
            <Route path="/stream" element={<ProtectedRoute><StreamSelect /></ProtectedRoute>} />
            <Route path="/setup" element={<ProtectedRoute requireStream><TestSetup /></ProtectedRoute>} />
            <Route path="/cbt-list" element={<ProtectedRoute><CBTList /></ProtectedRoute>} />
            <Route path="/feeds" element={<ProtectedRoute><Feeds /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute requireStream><Results /></ProtectedRoute>} />
          </Route>

          <Route path="/quiz" element={<ProtectedRoute requireStream><Quiz /></ProtectedRoute>} />
          
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </QuizProvider>
    </AuthProvider>
  );
}