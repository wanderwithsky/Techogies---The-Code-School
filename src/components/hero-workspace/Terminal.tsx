import { useEffect, useMemo, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import { runCommand, ALL_COMMAND_NAMES } from "./lib/commands";
import { FILE_BY_NAME, FILE_BY_PATH } from "./lib/files";
import { scrollToId } from "@/lib/scroll";
import type { TerminalLine } from "./lib/types";

const PROMPT = "techogies@workspace:~$";

const WELCOME: ReactNode = (
  <div className="space-y-1">
    <div className="text-[color:var(--brand)] font-semibold">Welcome to Techogies Workspace</div>
    <div className="text-white/60">
      Type <span className="text-[color:var(--brand)]">help</span> to see all commands.
      Try <span className="text-[color:var(--brand)]">courses</span>,{" "}
      <span className="text-[color:var(--brand)]">roadmap</span>, or{" "}
      <span className="text-[color:var(--brand)]">cat hero.jsx</span>.
    </div>
  </div>
);

export function Terminal({ onOpenFile }: { onOpenFile: (path: string) => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, kind: "output", node: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  const nextId = () => idRef.current++;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const submit = (raw: string) => {
    const cmd = raw;
    setLines((prev) => [
      ...prev,
      {
        id: nextId(),
        kind: "prompt",
        node: (
          <div className="flex gap-2">
            <span className="text-emerald-400/90">{PROMPT}</span>
            <span className="text-white/90">{cmd}</span>
          </div>
        ),
      },
    ]);
    if (cmd.trim()) {
      setHistory((h) => [...h, cmd]);
      setHistoryIdx(-1);
    }

    const pending: TerminalLine[] = [];
    let cleared = false;

    runCommand(cmd, {
      openFile: (p) => {
        const f = FILE_BY_PATH[p];
        if (f) onOpenFile(p);
      },
      clearTerminal: () => {
        cleared = true;
      },
      scrollTo: (id) => {
        if (typeof window !== "undefined") setTimeout(() => scrollToId(id), 250);
      },
      navigate: (to) => {
        router.navigate({ to });
      },
      print: (node) => pending.push({ id: nextId(), kind: "output", node }),
      filesByName: FILE_BY_NAME,
    });

    if (cleared) {
      setLines([]);
    } else if (pending.length) {
      setLines((prev) => [...prev, ...pending]);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);
      if (parts.length === 1 && parts[0]) {
        const match = ALL_COMMAND_NAMES.find((n) => n.startsWith(parts[0].toLowerCase()));
        if (match) setInput(match);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const focusInput = () => inputRef.current?.focus();

  const cursorLeft = useMemo(() => `${input.length}ch`, [input]);

  return (
    <div className="hidden md:flex h-[148px] flex-col border-t border-white/5 bg-black/50">
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        <span>Terminal</span>
        <span className="ml-auto text-emerald-400/80">● zsh — techogies</span>
      </div>
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="workspace-scroll flex-1 cursor-text overflow-y-auto px-3 py-2 font-mono text-[11.5px] leading-[1.6]"
      >
        {lines.map((l) => (
          <div key={l.id} className="select-text">
            {l.node}
          </div>
        ))}
        <div className="relative flex items-center gap-2">
          <span className="text-emerald-400/90 select-none">{PROMPT}</span>
          <div className="relative flex-1 select-none">
            <span className="whitespace-pre text-white/90">{input}</span>
            <span
              aria-hidden="true"
              style={{ left: cursorLeft }}
              className={`absolute top-1/2 -translate-y-1/2 inline-block h-[12px] w-[7px] bg-[color:var(--brand)] ${
                focused ? "animate-pulse" : "opacity-40"
              }`}
            />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Techogies workspace terminal"
              spellCheck={false}
              autoComplete="off"
              className="absolute inset-0 h-full w-full bg-transparent font-mono text-transparent caret-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}