import { Files, Search, GitBranch, Blocks, Settings, UserCircle2, type LucideIcon } from "lucide-react";
import { useState } from "react";

const ITEMS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Files, label: "Explorer" },
  { Icon: Search, label: "Search" },
  { Icon: GitBranch, label: "Source Control" },
  { Icon: Blocks, label: "Extensions" },
  { Icon: Settings, label: "Settings" },
  { Icon: UserCircle2, label: "Account" },
];

export function ActivityBar() {
  const [active, setActive] = useState("Explorer");
  return (
    <div className="hidden lg:flex w-11 flex-col items-center gap-1 border-r border-white/5 bg-black/30 py-3">
      {ITEMS.map(({ Icon, label }) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            onClick={() => setActive(label)}
            aria-label={label}
            className={`group relative grid h-9 w-9 place-items-center rounded-md transition ${
              isActive ? "text-white" : "text-white/40 hover:text-white/80"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-[color:var(--brand)]" />
            )}
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}