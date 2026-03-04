import { NotebookPen } from "lucide-react";

export default function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="p-5 rounded-full bg-zinc-800/60 mb-4">
        <NotebookPen size={32} className="text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">
        {hasFilter ? "No notes match that filter" : "No notes yet"}
      </h3>
      <p className="text-sm text-zinc-500 max-w-xs">
        {hasFilter
          ? "Try clearing the filter or searching something else."
          : 'Click "New Note" to create your first note.'}
      </p>
      {hasFilter && (
        <a
          href="/"
          className="mt-4 text-sm text-zinc-300 underline underline-offset-4 hover:text-zinc-100"
        >
          Clear filter
        </a>
      )}
    </div>
  );
}
