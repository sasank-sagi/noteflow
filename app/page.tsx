import { getAllNotes, getAllTags } from "@/lib/db";
import NoteCard from "@/components/NoteCard";
import NoteForm from "@/components/NoteForm";
import TagFilter from "@/components/TagFilter";
import EmptyState from "@/components/EmptyState";

type PageProps = {
  searchParams: Promise<{ tag?: string; q?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const { tag, q } = await searchParams;

  let notes = getAllNotes();
  const allTags = getAllTags();

  if (tag) {
    notes = notes.filter((n) =>
      n.tags.split(",").map((t) => t.trim()).includes(tag)
    );
  }
  if (q) {
    const query = q.toLowerCase();
    notes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }

  const pinnedNotes   = notes.filter((n) => n.pinned === 1);
  const unpinnedNotes = notes.filter((n) => n.pinned === 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-xl font-bold text-white tracking-tight">
            NoteFlow
          </h1>
          <form className="flex-1 max-w-sm" method="GET">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search notes..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </form>
          <span className="text-sm text-zinc-500 shrink-0">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
          <NoteForm />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {allTags.length > 0 && <TagFilter tags={allTags} activeTag={tag} />}

        {notes.length === 0 ? (
          <EmptyState hasFilter={!!(tag || q)} />
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Pinned
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </section>
            )}

            {unpinnedNotes.length > 0 && (
              <section>
                {pinnedNotes.length > 0 && (
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Notes
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unpinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
