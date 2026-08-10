export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}