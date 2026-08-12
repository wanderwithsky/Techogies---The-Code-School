import meta from "@/data/coursesMeta.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortBar({
  count,
  total,
  sort,
  onSort,
}: {
  count: number;
  total: number;
  sort: string;
  onSort: (v: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span> of {total} courses
      </p>
      <div className="flex items-center gap-2">
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