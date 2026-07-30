import type { Dispatch } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Filters } from "./types";
import { FiltersPanel } from "./FiltersPanel";

type Action =
  | { type: "patch"; value: Partial<Filters> }
  | { type: "toggleArray"; key: keyof Filters; value: string }
  | { type: "reset" };

export function FiltersSheet({
  open,
  onOpenChange,
  filters,
  dispatch,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filters: Filters;
  dispatch: Dispatch<Action>;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl border-border/60 bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 max-h-[calc(85vh-8rem)] overflow-y-auto pr-1">
          <FiltersPanel filters={filters} dispatch={dispatch} />
        </div>
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => dispatch({ type: "reset" })}
          >
            Reset
          </Button>
          <Button type="button" className="flex-1" onClick={() => onOpenChange(false)}>
            Show results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}