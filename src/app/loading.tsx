export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="pt-28 pb-20 mx-auto max-w-340 px-4 sm:px-6 lg:px-8 space-y-6"
    >
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-(--bg-surface) animate-pulse" />
        <div className="h-10 w-2/3 max-w-md rounded-lg bg-(--bg-surface) animate-pulse" />
      </div>
      <div className="h-32 rounded-2xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 rounded-xl border border-(--border-subtle) bg-(--bg-surface) animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
