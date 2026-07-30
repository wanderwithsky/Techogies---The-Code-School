export function WindowControls({ title = "Techogies Workspace" }: { title?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 bg-black/30 px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span
            key={c}
            style={{ background: c }}
            className="h-3 w-3 rounded-full transition-transform hover:scale-110"
          />
        ))}
      </div>
      <div className="flex-1 text-center text-[11px] font-medium text-white/60 tracking-wide">
        {title}
      </div>
      <div className="w-12" />
    </div>
  );
}