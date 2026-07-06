import type { ReactNode } from "react";

const tones: Record<string, string> = {
  Critical: "border-red-500/30 bg-red-500/10 text-red-300",
  High: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Low: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  Open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  WordPress: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  DNS: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  Cloudflare: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Hosting: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  SSL: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Email: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Malware: "border-red-500/30 bg-red-500/10 text-red-300",
  Performance: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
  default: "border-[#303640] bg-[#151920] text-[#a5adb8]",
};

export function Badge({ children, tone }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${tones[tone ?? ""] ?? tones.default}`}>{children}</span>;
}
