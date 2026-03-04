type Props = {
  tags: string[];
  activeTag?: string;
};

export default function TagFilter({ tags, activeTag }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-zinc-500 font-medium">Filter:</span>
      <a
        href="/"
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
          !activeTag
            ? "bg-zinc-100 text-zinc-900 border-zinc-100"
            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
        }`}
      >
        All
      </a>
      {tags.map((tag) => (
        <a
          key={tag}
          href={`/?tag=${encodeURIComponent(tag)}`}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            activeTag === tag
              ? "bg-zinc-100 text-zinc-900 border-zinc-100"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
          }`}
        >
          {tag}
        </a>
      ))}
    </div>
  );
}
