import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "noteflow.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (global.__db) return global.__db;

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      body       TEXT    NOT NULL DEFAULT '',
      tags       TEXT    NOT NULL DEFAULT '',
      color      TEXT    NOT NULL DEFAULT 'zinc',
      pinned     INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  global.__db = db;
  return db;
}

export type Note = {
  id: number;
  title: string;
  body: string;
  tags: string;
  color: string;
  pinned: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type NoteInput = Pick<Note, "title" | "body" | "tags" | "color">;

export function getAllNotes(): Note[] {
  return getDb()
    .prepare("SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC")
    .all() as Note[];
}

export function createNote(input: NoteInput): Note {
  return getDb()
    .prepare(
      "INSERT INTO notes (title, body, tags, color) VALUES (?, ?, ?, ?) RETURNING *"
    )
    .get(input.title, input.body, input.tags, input.color) as Note;
}

export function updateNote(id: number, input: Partial<NoteInput>): Note {
  const db = getDb();
  const fields = Object.keys(input)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(input);
  return db
    .prepare(
      `UPDATE notes SET ${fields}, updated_at = datetime('now') WHERE id = ? RETURNING *`
    )
    .get(...values, id) as Note;
}

export function togglePin(id: number): Note {
  return getDb()
    .prepare(
      "UPDATE notes SET pinned = CASE WHEN pinned = 1 THEN 0 ELSE 1 END, updated_at = datetime('now') WHERE id = ? RETURNING *"
    )
    .get(id) as Note;
}

export function deleteNote(id: number): void {
  getDb().prepare("DELETE FROM notes WHERE id = ?").run(id);
}

export function getAllTags(): string[] {
  const rows = getDb()
    .prepare("SELECT tags FROM notes WHERE tags != ''")
    .all() as { tags: string }[];
  const tagSet = new Set<string>();
  rows.forEach((row) => {
    row.tags.split(",").forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) tagSet.add(trimmed);
    });
  });
  return Array.from(tagSet).sort();
}
