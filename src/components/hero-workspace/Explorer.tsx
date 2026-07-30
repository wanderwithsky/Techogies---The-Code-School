import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Folder, FolderOpen, FileCode2, FileJson, FileText } from "lucide-react";
import { useState } from "react";
import { TREE } from "./lib/files";
import type { TreeNode } from "./lib/types";

function fileIcon(name: string) {
  if (name.endsWith(".json")) return <FileJson size={12} className="text-amber-300/80" />;
  if (name.endsWith(".js") || name.endsWith(".jsx") || name.endsWith(".tsx"))
    return <FileCode2 size={12} className="text-sky-300/80" />;
  return <FileText size={12} className="text-white/50" />;
}

function Row({
  node,
  depth,
  activePath,
  onOpen,
  openFolders,
  toggleFolder,
}: {
  node: TreeNode;
  depth: number;
  activePath: string;
  onOpen: (path: string) => void;
  openFolders: Record<string, boolean>;
  toggleFolder: (path: string) => void;
}) {
  const pad = { paddingLeft: 8 + depth * 12 };
  if (node.type === "folder") {
    const open = openFolders[node.path] ?? depth < 2;
    return (
      <div>
        <button
          type="button"
          style={pad}
          onClick={() => toggleFolder(node.path)}
          className="flex w-full items-center gap-1 py-0.5 text-left text-white/75 hover:text-white"
        >
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight size={12} className="text-white/40" />
          </motion.span>
          {open ? (
            <FolderOpen size={13} className="text-[color:var(--brand)]" />
          ) : (
            <Folder size={13} className="text-[color:var(--brand)]/80" />
          )}
          <span className="text-[12px]">{node.name}</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="c"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map((c, i) => (
                <Row
                  key={i}
                  node={c}
                  depth={depth + 1}
                  activePath={activePath}
                  onOpen={onOpen}
                  openFolders={openFolders}
                  toggleFolder={toggleFolder}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  const isActive = activePath === node.path;
  return (
    <button
      type="button"
      style={pad}
      onClick={() => onOpen(node.path)}
      className={`flex w-full items-center gap-1.5 py-0.5 text-left rounded-sm transition ${
        isActive
          ? "bg-[color:var(--brand)]/15 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white/90"
      }`}
    >
      <span className="w-3" />
      {fileIcon(node.name)}
      <span className="text-[12px]">{node.name}</span>
    </button>
  );
}

export function Explorer({
  activePath,
  onOpen,
}: {
  activePath: string;
  onOpen: (path: string) => void;
}) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "/": true,
    "/src": true,
    "/src/components": true,
  });
  const toggleFolder = (path: string) =>
    setOpenFolders((s) => ({ ...s, [path]: !(s[path] ?? false) }));

  return (
    <div className="hidden md:flex w-[210px] xl:w-[230px] flex-col border-r border-white/5 bg-black/20 py-2 text-[12px]">
      <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        Explorer
      </div>
      <div className="overflow-y-auto overflow-x-hidden">
        <Row
          node={TREE}
          depth={0}
          activePath={activePath}
          onOpen={onOpen}
          openFolders={openFolders}
          toggleFolder={toggleFolder}
        />
      </div>
    </div>
  );
}