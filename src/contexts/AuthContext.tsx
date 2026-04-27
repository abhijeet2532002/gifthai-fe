import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signupHandler, loginHandler } from "@/api/auth";
import { signupPayload, loginPayload } from "@/api/auth";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signup: (data: { firstName?: string; lastName?: string; email?: string; password?: string }) => Promise<void>;
  login: (data: { email?: string; password?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, "firstName" | "lastName" | "email">>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "aurum-users";
const SESSION_KEY = "aurum-session";

// Lightweight, NON-cryptographic hash — purely to avoid storing plain text in
// localStorage in this UI-only demo. Replace with real auth (Lovable Cloud)
// before going to production.
const hash = async (text: string): Promise<string> => {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const readUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeUsers = (users: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const persistSession = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  };

  const signup: AuthContextValue["signup"] = async (payload: signupPayload) => {
    await signupHandler(payload);
    const normalized = payload.email.trim().toLowerCase();
    const users = readUsers();
    if (users.some((u) => u.email === normalized)) {
      throw new Error("An account with this email already exists.");
    }
    const passwordHash = await hash(payload.password);
    const stored: StoredUser = {
      id: crypto.randomUUID(),
      firstName: payload.fname.trim(),
      lastName: payload.lname.trim(),
      email: normalized,
      passwordHash,
    };
    writeUsers([...users, stored]);
    const { passwordHash: _ph, ...publicUser } = stored;
    persistSession(publicUser);
  };

  const login: AuthContextValue["login"] = async (payload:loginPayload) => {
    await loginHandler(payload);
    const normalized = payload.email.trim().toLowerCase();
    const users = readUsers();
    const found = users.find((u) => u.email === normalized);
    if (!found) throw new Error("No account found with that email.");
    const passwordHash = await hash(payload.password);
    if (found.passwordHash !== passwordHash) throw new Error("Incorrect password.");
    const { passwordHash: _ph, ...publicUser } = found;
    persistSession(publicUser);
  };

  const logout = () => persistSession(null);

  const updateProfile: AuthContextValue["updateProfile"] = (data) => {
    if (!user) return;
    const next = { ...user, ...data };
    persistSession(next);
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...data };
      writeUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
