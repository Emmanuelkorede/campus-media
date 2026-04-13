// TODO
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// ─────────────────────────────────────────────
//  AUTH CONTEXT
//
//  Manages the logged-in student (or admin).
//  Uses Supabase to check name + password.
//  Persists the session in localStorage so
//  the user stays logged in on page refresh.
//
//  Wrap your entire app in <AuthProvider>
//  then read state anywhere with useAuth().
//
//  What's stored in context:
//    user     – { id, name, stream, role } | null
//    loading  – true while resolving session on mount
//
//  What you can call:
//    login(name, password)  → { success, error }
//    logout()
//    setStream(stream)      → saves stream to DB + context
// ─────────────────────────────────────────────

const LOCAL_KEY = "campusmedia_user"; // localStorage key

const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Rehydrate from localStorage on mount ──
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(LOCAL_KEY);
      }
    }
    setLoading(false);
  }, []);

  // ── Persist user to localStorage ──────────
  function persist(userObj) {
    if (userObj) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
    setUser(userObj);
  }

  // ── LOGIN / REGISTER ──────────────────────
  // If the name doesn't exist → create the account.
  // If it does → verify password.
  // Returns { success: bool, error: string | null }
  const login = useCallback(async (name, password) => {
    if (!name?.trim() || !password?.trim()) {
      return { success: false, error: "Please fill in both fields." };
    }

    const cleanName = name.trim().toLowerCase();

    // Look up the user
    const { data: existing, error: fetchErr } = await supabase
      .from("users")
      .select("id, name, password, stream, role")
      .eq("name", cleanName)
      .maybeSingle();

    if (fetchErr) {
      return { success: false, error: "Something went wrong. Try again." };
    }

    // ── New user → register ────────────────
    if (!existing) {
      const { data: created, error: createErr } = await supabase
        .from("users")
        .insert({ name: cleanName, password, role: "student" })
        .select("id, name, stream, role")
        .single();

      if (createErr) {
        return { success: false, error: "Could not create account. Try again." };
      }

      persist(created);
      return { success: true, error: null };
    }

    // ── Existing user → verify password ───
    if (existing.password !== password) {
      return { success: false, error: "Incorrect password." };
    }

    const { password: _pw, ...safeUser } = existing; // don't keep password in state
    persist(safeUser);
    return { success: true, error: null };
  }, []);

  // ── ADMIN LOGIN ───────────────────────────
  // Separate function so admin login page can
  // call this and get role-checked.
  const adminLogin = useCallback(async (name, password) => {
    const result = await login(name, password);
    if (!result.success) return result;

    // After login, check if role is admin
    const stored = JSON.parse(localStorage.getItem(LOCAL_KEY));
    if (stored?.role !== "admin") {
      persist(null); // log them back out
      return { success: false, error: "You do not have admin access." };
    }

    return { success: true, error: null };
  }, [login]);

  // ── SET STREAM ────────────────────────────
  // Called after the user picks Science / Arts / Commercial.
  // Saves to Supabase and updates local state.
  const setStream = useCallback(async (stream) => {
    if (!user?.id) return;

    await supabase
      .from("users")
      .update({ stream })
      .eq("id", user.id);

    const updated = { ...user, stream };
    persist(updated);
  }, [user]);

  // ── LOGOUT ────────────────────────────────
  const logout = useCallback(() => {
    persist(null);
  }, []);

  const value = { user, loading, login, adminLogin, logout, setStream };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────
// Use this in any component:
//   const { user, login, logout } = useAuth();

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}