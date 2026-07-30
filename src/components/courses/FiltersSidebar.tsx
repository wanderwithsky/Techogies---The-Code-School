import type { Dispatch } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Filters } from "./types";
import { FiltersPanel } from "./FiltersPanel";

type Action =
  | { type: "patch"; value: Partial<Filters> }
  | { type: "toggleArray"; key: keyof Filters; value: string }
  | { type: "reset" };

export function FiltersSidebar({
  filters,
  dispatch,
}: {
  filters: Filters;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-primary"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>
      <FiltersPanel filters={filters} dispatch={dispatch} />
    </div>
  );
}