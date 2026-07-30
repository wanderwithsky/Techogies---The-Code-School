import { GitBranch, Check } from "lucide-react";

export function StatusBar() {
  return (
    <div className="hidden lg:flex items-center gap-3 border-t border-white/5 bg-[color:var(--brand)]/90 px-3 py-1 text-[10px] font-medium text-black/80">
      <span className="inline-flex items-center gap-1">
        <GitBranch size={11} /> main
      </span>
      <span className="inline-flex items-center gap-1">
        <Check size={11} /> 0 errors
      </span>
      <span className="ml-auto">UTF-8</span>
      <span>JSX</span>
      <span>Techogies IDE</span>
    </div>
  );
}