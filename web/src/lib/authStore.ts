"use client";

import { clearUserData } from "@/lib/storage";

const K_USERS = "waku_users_v1";
const K_SESSION = "waku_session_v1";

export type StoredUser = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  passwordHash: string;
};

export type Session = { userId: string } | null;

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function hash(pw: string) {
  // (MVP) hash très simple (à remplacer côté DB)
  return btoa(unescape(encodeURIComponent(pw))).split("").reverse().join("");
}

export function isStrongPassword(pw: string) {
  // min 8, 1 maj, 1 min, 1 chiffre
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

export function getUsers(): StoredUser[] {
  return safeRead<StoredUser[]>(K_USERS, []);
}

export function getSession(): Session {
  return safeRead<Session>(K_SESSION, null);
}

export function getCurrentUser(): StoredUser | null {
  const s = getSession();
  if (!s?.userId) return null;
  const u = getUsers().find((x) => x.id === s.userId);
  return u ?? null;
}

export function register(username: string, email: string, password: string) {
  username = username.trim();
  email = email.trim().toLowerCase();

  if (!username) throw new Error("Le username est requis.");
  if (!email) throw new Error("L’email est requis.");
  if (!isStrongPassword(password)) throw new Error("Mot de passe trop faible.");

  const users = getUsers();
  if (users.some((u) => u.email === email)) throw new Error("Email déjà utilisé.");
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error("Username déjà utilisé.");

  const user: StoredUser = {
    id: uid(),
    username,
    email,
    avatarUrl: "/branding/logo.png",
    passwordHash: hash(password),
  };

  users.push(user);
  safeWrite(K_USERS, users);
  safeWrite(K_SESSION, { userId: user.id } as Session);
  return user;
}

export function login(email: string, password: string) {
  email = email.trim().toLowerCase();
  const users = getUsers();
  const u = users.find((x) => x.email === email);
  if (!u) throw new Error("Compte introuvable.");
  if (u.passwordHash !== hash(password)) throw new Error("Mot de passe incorrect.");

  safeWrite(K_SESSION, { userId: u.id } as Session);
  return u;
}

export function logout() {
  safeWrite(K_SESSION, null);
  // MVP : quand on logout, on enlève les données locales (sinon “fantômes” en visiteur)
  clearUserData();
}

export function updateProfile(patch: { username?: string; email?: string; avatarUrl?: string }) {
  const cur = getCurrentUser();
  if (!cur) throw new Error("Non connecté.");

  const users = getUsers();
  const i = users.findIndex((u) => u.id === cur.id);
  if (i < 0) throw new Error("Utilisateur introuvable.");

  const next = { ...users[i] };

  if (typeof patch.username === "string") {
    const username = patch.username.trim();
    if (!username) throw new Error("Username invalide.");
    if (
      users.some(
        (u) => u.id !== cur.id && u.username.toLowerCase() === username.toLowerCase()
      )
    )
      throw new Error("Username déjà utilisé.");
    next.username = username;
  }

  if (typeof patch.email === "string") {
    const email = patch.email.trim().toLowerCase();
    if (!email) throw new Error("Email invalide.");
    if (users.some((u) => u.id !== cur.id && u.email === email))
      throw new Error("Email déjà utilisé.");
    next.email = email;
  }

  if (typeof patch.avatarUrl === "string") {
    const a = patch.avatarUrl.trim();
    next.avatarUrl = a || "/branding/logo.png";
  }

  users[i] = next;
  safeWrite(K_USERS, users);
  return next;
}

export function changePassword(oldPw: string, newPw: string) {
  const cur = getCurrentUser();
  if (!cur) throw new Error("Non connecté.");

  if (cur.passwordHash !== hash(oldPw)) throw new Error("Ancien mot de passe incorrect.");
  if (!isStrongPassword(newPw)) throw new Error("Mot de passe trop faible.");

  const users = getUsers();
  const i = users.findIndex((u) => u.id === cur.id);
  if (i < 0) throw new Error("Utilisateur introuvable.");

  users[i] = { ...users[i], passwordHash: hash(newPw) };
  safeWrite(K_USERS, users);
}

export function forgotPassword(email: string) {
  email = email.trim().toLowerCase();
  const users = getUsers();
  const u = users.find((x) => x.email === email);

  // Pour ne pas révéler si un email existe, on renvoie toujours OK (pratique réelle)
  if (!u) return { ok: true, message: "Si un compte existe, un lien de réinitialisation a été envoyé." };

  // MVP: token fictif (dans un vrai projet: email + token signé + expiration)
  const token = Math.random().toString(16).slice(2) + Date.now().toString(16);

  // On renvoie une URL de reset fictive (page future)
  const resetUrl = `/auth/reset?token=${token}&email=${encodeURIComponent(email)}`;

  return { ok: true, resetUrl, message: "Lien de réinitialisation généré (MVP)." };
}