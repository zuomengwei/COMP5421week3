"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getNotes,
  getServerNotes,
  subscribeNotes,
  updateNotes,
} from "@/lib/notes";
import Editor from "./Editor";
import NoteList from "./NoteList";

export default function NotesApp() {
  // Notes live in a small external store (backed by localStorage), so we can
  // read them with useSyncExternalStore instead of loading them in an effect.
  const notes = useSyncExternalStore(subscribeNotes, getNotes, getServerNotes);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effective active note: an explicit selection, falling back to the
  // most recently edited note at the top of the list.
  const activeId =
    selectedId && notes.some((n) => n.id === selectedId)
      ? selectedId
      : (notes[0]?.id ?? null);

  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  // Case-insensitive search over title and body. An empty query keeps all.
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, query]);

  // Cancel a pending autosave when the component unmounts.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const flash = useCallback((message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 1500);
  }, []);

  /** Commit a note: normalize title, bump timestamp, re-sort newest first. */
  const finalizeSave = useCallback(
    (id: string) => {
      const now = Date.now();
      updateNotes((prev) =>
        [...prev]
          .map((n) =>
            n.id === id
              ? { ...n, title: n.title.trim() || "Untitled", updatedAt: now }
              : n
          )
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
      flash("Saved");
    },
    [flash]
  );

  /** Debounced autosave: fires 500ms after the last keystroke. */
  const scheduleSave = useCallback(
    (id: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => finalizeSave(id), 500);
    },
    [finalizeSave]
  );

  const createNote = () => {
    const note = {
      id: Date.now().toString(),
      title: "Untitled",
      body: "",
      updatedAt: Date.now(),
    };
    updateNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  };

  const handleEdit = (field: "title" | "body", value: string) => {
    if (!activeId) return;
    updateNotes((prev) =>
      prev.map((n) =>
        n.id === activeId
          ? field === "title"
            ? { ...n, title: value }
            : { ...n, body: value }
          : n
      )
    );
    setStatus("Editing...");
    scheduleSave(activeId);
  };

  const handleSelect = (id: string) => {
    if (id === activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (activeId) finalizeSave(activeId); // commit edits to the note we are leaving
    setSelectedId(id);
  };

  const handleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (activeId) finalizeSave(activeId);
  };

  const handleDelete = () => {
    if (!activeNote) return;
    if (!window.confirm("Delete this note?")) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    updateNotes((prev) => prev.filter((n) => n.id !== activeId));
    setSelectedId(null);
    setStatus("");
  };

  return (
    <div className="app">
      <header>
        <h1>Notes</h1>
        <button onClick={createNote}>+ New Note</button>
      </header>

      <main>
        <aside>
          <NoteList
            notes={filteredNotes}
            hasNotes={notes.length > 0}
            query={query}
            activeId={activeId}
            onSelect={handleSelect}
            onQueryChange={setQuery}
          />
        </aside>

        <Editor
          note={activeNote}
          status={status}
          onTitleChange={(value) => handleEdit("title", value)}
          onBodyChange={(value) => handleEdit("body", value)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}