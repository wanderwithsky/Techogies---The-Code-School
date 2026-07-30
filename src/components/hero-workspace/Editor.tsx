import { AnimatePresence, motion } from "framer-motion";
import { EditorTabs } from "./EditorTabs";
import { FILE_BY_PATH } from "./lib/files";
import { highlight, lineCount } from "./lib/highlight";

export function Editor({
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
  const file = FILE_BY_PATH[activePath];
  const source = file?.source ?? "";
  const lines = lineCount(source);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[oklch(0.19_0.012_40)]">
      <EditorTabs
        openFiles={openFiles}
        activePath={activePath}
        onSelect={onSelect}
        onClose={onClose}
      />
      <div className="workspace-editor relative flex-1 overflow-auto font-mono text-[12px] leading-[1.6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex min-h-full"
          >
            <div className="sticky left-0 shrink-0 select-none border-r border-white/5 bg-black/20 py-3 pl-3 pr-3 text-right text-white/30">
              {Array.from({ length: Math.max(lines, 1) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="min-w-0 flex-1 py-3 pl-4 pr-4">
              {source ? (
                highlight(source, file?.language ?? "jsx")
              ) : (
                <div className="text-white/40 italic">
                  {file ? `${file.name} — empty file` : "Select a file from the explorer"}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}