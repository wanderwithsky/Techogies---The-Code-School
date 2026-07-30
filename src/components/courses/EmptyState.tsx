import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/40 px-6 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <SearchX size={26} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">No matching courses found</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try adjusting your filters or search terms — we'll help you find the right path.
      </p>
      <Button type="button" onClick={onReset} className="mt-6 rounded-full">
        Reset Filters
      </Button>
    </div>
  );
}