import { useState } from "react";
import type { Dispatch } from "react";
import meta from "@/data/coursesMeta.json";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Filters } from "./types";

type Action =
  | { type: "patch"; value: Partial<Filters> }
  | { type: "toggleArray"; key: keyof Filters; value: string }
  | { type: "reset" };

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-border/60 py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function FiltersPanel({
  filters,
  dispatch,
}: {
  filters: Filters;
  dispatch: Dispatch<Action>;
}) {
  const [techExpanded, setTechExpanded] = useState(false);
  const visibleTech = techExpanded ? meta.technologies : meta.technologies.slice(0, 10);

  const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <FilterGroup title="Learning Path">
        <div className="space-y-2.5">
          {meta.learningPaths.map((p) => {
            const id = `lp-${p}`;
            return (
              <div key={p} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={filters.learningPaths.includes(p)}
                  onCheckedChange={() =>
                    dispatch({ type: "toggleArray", key: "learningPaths", value: p })
                  }
                />
                <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-foreground/90">
                  {p}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Difficulty">
        <RadioGroup
          value={filters.difficulty ?? ""}
          onValueChange={(v) => dispatch({ type: "patch", value: { difficulty: v || null } })}
          className="space-y-2.5"
        >
          {meta.difficulties.map((d) => (
            <div key={d} className="flex items-center gap-2.5">
              <RadioGroupItem id={`d-${d}`} value={d} />
              <Label htmlFor={`d-${d}`} className="cursor-pointer text-sm font-normal text-foreground/90">
                {d}
              </Label>
            </div>
          ))}
          {filters.difficulty && (
            <button
              type="button"
              onClick={() => dispatch({ type: "patch", value: { difficulty: null } })}
              className="mt-1 text-xs text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </RadioGroup>
      </FilterGroup>

      <FilterGroup title="Duration">
        <div className="space-y-2.5">
          {meta.durationBuckets.map((b) => (
            <div key={b.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`dur-${b.id}`}
                checked={filters.durationBuckets.includes(b.id)}
                onCheckedChange={() =>
                  dispatch({ type: "toggleArray", key: "durationBuckets", value: b.id })
                }
              />
              <Label htmlFor={`dur-${b.id}`} className="cursor-pointer text-sm font-normal text-foreground/90">
                {b.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Mode">
        <div className="space-y-2.5">
          {meta.modes.map((m) => (
            <div key={m} className="flex items-center gap-2.5">
              <Checkbox
                id={`m-${m}`}
                checked={filters.modes.includes(m)}
                onCheckedChange={() => dispatch({ type: "toggleArray", key: "modes", value: m })}
              />
              <Label htmlFor={`m-${m}`} className="cursor-pointer text-sm font-normal text-foreground/90">
                {m}
              </Label>
            </div>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Support">
        <div className="space-y-3">
          {(
            [
              ["placement", "Placement Included"],
              ["internship", "Internship Included"],
              ["certificate", "Certificate Included"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <Label htmlFor={`sw-${key}`} className="cursor-pointer text-sm font-normal text-foreground/90">
                {label}
              </Label>
              <Switch
                id={`sw-${key}`}
                checked={filters[key] as boolean}
                onCheckedChange={(v) => dispatch({ type: "patch", value: { [key]: v } as Partial<Filters> })}
              />
            </div>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Technologies">
        <div className="flex flex-wrap gap-1.5">
          {visibleTech.map((t) => {
            const on = filters.technologies.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => dispatch({ type: "toggleArray", key: "technologies", value: t })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  on
                    ? "border-primary/50 bg-primary/12 text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.25)]"
                    : "border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
                aria-pressed={on}
              >
                {t}
              </button>
            );
          })}
        </div>
        {meta.technologies.length > 10 && (
          <button
            type="button"
            onClick={() => setTechExpanded((v) => !v)}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            {techExpanded ? "Show less" : `Show all (${meta.technologies.length})`}
          </button>
        )}
      </FilterGroup>
    </div>
  );
}