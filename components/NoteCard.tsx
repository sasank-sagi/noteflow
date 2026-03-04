"use client";

import { useTransition } from "react";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { deleteNoteAction, togglePinAction } from "@/app/actions";
import type { Note } from "@/lib/db";
import NoteForm from "./NoteForm";

const colorBorder: Record<string, string> = {
  zinc:    "border-zinc-600",
  rose:    "border-rose-500",
  sky:     "border-sky-500",
  amber:   "border-amber-500",
  emerald: "border-emerald-500",
  violet:  "border-violet-500",
};

const colorBadge: Record<string, string> = {
  zinc:    "bg-zinc-700 text-zinc-200",
  rose:    "bg-rose-900/40 text-rose-300",
  sky:     "bg-sky-900/40 text-sky-300",
  amber:   "bg-amber-900/40 text-amber-300",
  emerald: "bg-emerald-900/40 text-emerald-300",
  violet:  "bg-violet-900/40 text-violet-300",
};

export default function NoteCard({ note }: { note: Note }) {
  const [isPending, startTransition] = useTransition();

  const tags = note.tags
    ? note.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const border = colorBorder[note.color] ?? colorBorder.zinc;
  const badge  = colorBadge[note.color]  ?? colorBadge.zinc;

  return (
    <article
      className={`
        group relative bg-zinc-900 border-l-4 ${border}
        rounded-xl p-4 flex flex-col gap-3
        transition-all duration-200
        ${note.pinned ? "ring-1 ring-zinc-600" : "hover:ring-1 hover:ring-zinc-700"}
        ${isPending ? "opacity-40 pointer-events-none" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-zinc-100 leading-snug line-clamp-2 flex-1">
          {note.title}
        </h2>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => startTransition(async () => { await togglePinAction(note.id); })}
            title={note.pinned ? "Unpin" : "Pin"}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
          >
            {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <NoteForm initialNote={note} />
          <button
            onClick={() => {
              if (!confirm("Delete this note?")) return;
              startTransition(async () => { await deleteNoteAction(note.id); });
            }}
            title="Delete"
            className="p-1 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {note.body && (
        <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed whitespace-pre-wrap">
          {note.body}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}
            >
              {tag}
            </a>
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-600">
        {new Date(note.updated_at + "Z").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </article>
  );
}
