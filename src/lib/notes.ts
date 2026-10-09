export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};

export const STORAGE_KEY = "notes-app-v1";

function readStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Note[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Module-level cache of the notes, kept in sync with localStorage. On the
// server there is no localStorage, so the cache starts empty there.
let cache: Note[] = typeof window === "undefined" ? [] : readStorage();

const listeners = new Set<() => void>();

/** Snapshot used by useSyncExternalStore on the client. */
export function getNotes(): Note[] {
  return cache;
}

/** Snapshot used by useSyncExternalStore during SSR/hydration. */
export function getServerNotes(): Note[] {
  return [];
}

export function subscribeNotes(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: Note[]): void {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors (e.g. private browsing mode).
  }
  listeners.forEach((listener) => listener());
}

/** Replace all notes and persist them. */
export function setNotes(next: Note[]): void {
  commit(next);
}

/** Functional update: pass a mapper that returns a new array. */
export function updateNotes(updater: (prev: Note[]) => Note[]): void {
  commit(updater(cache));
}