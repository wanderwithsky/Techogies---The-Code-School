import { SlidersHorizontal } from "lucide-react";
import meta from "@/data/coursesMeta.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SortBar({
  count,
  total,
  sort,
  onSort,
  onOpenFilters,
  activeFilterCount,
}: {
  count: number;
  total: number;
  sort: string;
  onSort: (v: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span> of {total} courses
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="lg:hidden"
        >
          <SlidersHorizontal size={14} className="mr-1.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <Select value={sort} onValueChange={onSort}>
          <SelectTrigger className="h-9 w-[190px] rounded-full bg-background/70 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {meta.sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}