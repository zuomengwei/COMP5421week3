# Notes

A simple note-taking app rebuilt with [Next.js](https://nextjs.org) (App Router, TypeScript).

## Features

- Create, edit, save, and delete notes
- Autosave 500 ms after you stop typing
- Search notes by title or body
- Notes persist in the browser's `localStorage`
- Most recently edited notes appear first
- Responsive two-column layout on a blue background

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Project structure

- `src/app/layout.tsx` — root layout and fonts
- `src/app/page.tsx` — home page (server component)
- `src/components/NotesApp.tsx` — client component holding all app state
- `src/components/NoteList.tsx` — sidebar with search and the note list
- `src/components/Editor.tsx` — title/body editor with Save/Delete actions
- `src/lib/notes.ts` — `Note` type and localStorage helpers
- `src/app/globals.css` — global styles