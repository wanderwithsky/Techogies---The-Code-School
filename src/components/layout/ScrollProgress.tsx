import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const p = useScrollProgress();
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-brand transition-[width] duration-100"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}