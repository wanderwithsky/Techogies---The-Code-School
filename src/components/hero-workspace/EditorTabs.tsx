import { FileCode2, X } from "lucide-react";
import { FILE_BY_PATH } from "./lib/files";

export function EditorTabs({
  openFiles,
  activePath,
  onSelect,
  onClose,
}: {
  openFiles: string[];
  activePath: string;
  onSelect: (p: string) => void;
  onClose: (p: string) => void;
}) {
  return (
    <div className="flex items-end overflow-x-auto border-b border-white/5 bg-black/25 text-[11px]">
      {openFiles.map((path) => {
        const f = FILE_BY_PATH[path];
        if (!f) return null;
        const active = path === activePath;
        return (
          <div
            key={path}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(path)}
            className={`group relative flex cursor-pointer items-center gap-2 border-r border-white/5 px-4 py-2 ${
              active
                ? "bg-[oklch(0.19_0.012_40)] text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <FileCode2 size={11} className="text-[color:var(--brand)]/80" />
            <span>{f.name}</span>
            <button
              type="button"
              aria-label={`Close ${f.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose(path);
              }}
              className="rounded p-0.5 text-white/30 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
            >
              <X size={10} />
            </button>
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[color:var(--brand)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}