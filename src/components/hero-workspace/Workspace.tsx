import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { WindowControls } from "./WindowControls";
import { ActivityBar } from "./ActivityBar";
import { Explorer } from "./Explorer";
import { Editor } from "./Editor";
import { Terminal } from "./Terminal";
import { StatusBar } from "./StatusBar";
import { DEFAULT_FILE, FILE_BY_PATH } from "./lib/files";

export function Workspace() {
  const [openFiles, setOpenFiles] = useState<string[]>([DEFAULT_FILE]);
  const [activePath, setActivePath] = useState<string>(DEFAULT_FILE);

  const openFile = useCallback((path: string) => {
    if (!FILE_BY_PATH[path]) return;
    setOpenFiles((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setActivePath(path);
  }, []);

  const closeFile = useCallback(
    (path: string) => {
      setOpenFiles((prev) => {
        const next = prev.filter((p) => p !== path);
        if (activePath === path) {
          const fallback = next[next.length - 1] ?? "";
          setActivePath(fallback);
        }
        return next;
      });
    },
    [activePath]
  );

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.16_0.012_40)] shadow-elegant backdrop-blur-xl"
    >
      <WindowControls />
      <div className="flex h-[440px] md:h-[480px] lg:h-[500px]">
        <ActivityBar />
        <Explorer activePath={activePath} onOpen={openFile} />
        <Editor
          openFiles={openFiles}
          activePath={activePath}
          onSelect={setActivePath}
          onClose={closeFile}
        />
      </div>
      <Terminal onOpenFile={openFile} />
      <StatusBar />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
    </motion.div>
  );
}