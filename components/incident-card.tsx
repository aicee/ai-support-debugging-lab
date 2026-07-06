import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Incident } from "@/lib/types";
import { Badge } from "./badge";

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <Link href={`/incidents/${incident.id}`} className="focus-ring group panel block rounded-lg p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#3d4652] hover:bg-[#12161c]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2"><span className="mono text-[11px] text-[#707986]">{incident.incidentId}</span><Badge tone="Open">Open</Badge></div>
        <ArrowUpRight size={16} className="text-[#59616d] transition group-hover:text-[#b7f36b]" />
      </div>
      <h3 className="min-h-12 text-[15px] font-semibold leading-6 text-[#e5e8ec] group-hover:text-white">{incident.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#89919e]">{incident.customerImpact}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#222832] pt-4">
        <Badge tone={incident.product}>{incident.product}</Badge><Badge tone={incident.severity}>{incident.severity}</Badge><Badge>{incident.difficulty}</Badge>{incident.category !== incident.product && <Badge tone={incident.category}>{incident.category}</Badge>}
      </div>
      <div className="mono mt-3 text-[10px] uppercase tracking-wider text-[#656e7a]">{incident.error}</div>
    </Link>
  );
}
