import type { Avis, EntreeCollection, StatutLecture } from "./types";

const K_COLLECTION = "waku_collection_v1";
const K_AVIS = "waku_avis_v1";

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

/* COLLECTION */
export function getCollection(): EntreeCollection[] {
  return safeRead<EntreeCollection[]>(K_COLLECTION, []);
}

export function getStatut(mangaId: number): StatutLecture | null {
  return getCollection().find((x) => x.mangaId === mangaId)?.statut ?? null;
}

export function setStatut(mangaId: number, statut: StatutLecture) {
  const data = getCollection();
  const i = data.findIndex((x) => x.mangaId === mangaId);
  const next: EntreeCollection = { mangaId, statut, updatedAt: Date.now() };
  if (i >= 0) data[i] = next;
  else data.push(next);
  safeWrite(K_COLLECTION, data);
}

export function removeFromCollection(mangaId: number) {
  safeWrite(K_COLLECTION, getCollection().filter((x) => x.mangaId !== mangaId));
}

/* AVIS */
export function getAvisAll(): Avis[] {
  return safeRead<Avis[]>(K_AVIS, []);
}

export function getAvis(mangaId: number): Avis | null {
  return getAvisAll().find((a) => a.mangaId === mangaId) ?? null;
}

export function setAvis(mangaId: number, note: number, commentaire?: string) {
  const data = getAvisAll();
  const i = data.findIndex((a) => a.mangaId === mangaId);
  const next: Avis = {
    mangaId,
    note,
    commentaire: commentaire?.trim() || undefined,
    updatedAt: Date.now(),
  };
  if (i >= 0) data[i] = next;
  else data.push(next);
  safeWrite(K_AVIS, data);
}

export function removeAvis(mangaId: number) {
  safeWrite(K_AVIS, getAvisAll().filter((a) => a.mangaId !== mangaId));
}

/* CLEANUP */
export function clearUserData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(K_COLLECTION);
  localStorage.removeItem(K_AVIS);
}