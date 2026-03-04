"use client";

import { useState, useTransition, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Pencil, X, Loader2 } from "lucide-react";
import { createNoteAction, updateNoteAction } from "@/app/actions";
import type { Note } from "@/lib/db";

const COLORS = [
  { name: "zinc",    dot: "bg-zinc-500" },
  { name: "rose",    dot: "bg-rose-500" },
  { name: "sky",     dot: "bg-sky-500" },
  { name: "amber",   dot: "bg-amber-500" },
  { name: "emerald", dot: "bg-emerald-500" },
  { name: "violet",  dot: "bg-violet-500" },
];

export default function NoteForm({ initialNote }: { initialNote?: Note }) {
  const isEdit = !!initialNote;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(initialNote?.color ?? "zinc");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const input = {
      title: data.get("title") as string,
      body:  data.get("body")  as string,
      tags:  data.get("tags")  as string,
      color,
    };
    startTransition(async () => {
      const result = isEdit
        ? await updateNoteAction(initialNote.id, input)
        : await createNoteAction(input);

      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        formRef.current?.reset();
        if (!isEdit) setColor("zinc");
      }
    });
  }

  return (
    <>
      {isEdit ? (
        <button
          onClick={() => setOpen(true)}
          title="Edit"
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
        >
          <Pencil size={14} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 bg-white text-zinc-900 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <Plus size={15} />
          New Note
        </button>
      )}

      {open && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="font-semibold text-zinc-100">
                {isEdit ? "Edit Note" : "New Note"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X size={16} />
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <p className="text-sm text-rose-400 bg-rose-900/20 border border-rose-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Title *
                </label>
                <input
                  name="title"
                  defaultValue={initialNote?.title}
                  required
                  autoFocus
                  placeholder="Note title..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Body
                </label>
                <textarea
                  name="body"
                  defaultValue={initialNote?.body}
                  rows={5}
                  placeholder="Write anything..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Tags (comma-separated)
                </label>
                <input
                  name="tags"
                  defaultValue={initialNote?.tags}
                  placeholder="react, typescript, ideas"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Color accent
                </label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setColor(c.name)}
                      className={`w-7 h-7 rounded-full ${c.dot} transition-all ${
                        color === c.name
                          ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                          : "hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 disabled:opacity-50 transition-colors"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  {isEdit ? "Save changes" : "Create note"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
