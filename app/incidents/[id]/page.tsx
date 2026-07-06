import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleAlert } from "lucide-react";
import { Badge } from "@/components/badge";
import { InvestigationWorkspace } from "@/components/investigation-workspace";
import { getIncident, incidents } from "@/lib/incidents";

export function generateStaticParams() { return incidents.map(({ id }) => ({ id })); }

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = getIncident(id);
  if (!incident) notFound();
  return <main className="mx-auto max-w-[1180px] px-5 py-8 lg:px-8 lg:py-12">
    <Link href="/#incident-queue" className="focus-ring mb-8 inline-flex items-center gap-2 rounded text-xs font-medium text-[#7f8894] transition hover:text-white"><ArrowLeft size={14} /> Back to incident queue</Link>
    <div className="mb-8 grid gap-6 border-b border-[#242a33] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2"><span className="mono text-xs font-semibold text-[#b7f36b]">{incident.incidentId}</span><Badge tone="Open">{incident.status}</Badge><Badge tone={incident.severity}>{incident.severity}</Badge><Badge tone={incident.category}>{incident.category}</Badge></div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">{incident.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#828b97]"><span>Product <strong className="ml-1 font-medium text-[#c4cad1]">{incident.product}</strong></span><span>Category <strong className="ml-1 font-medium text-[#c4cad1]">{incident.category}</strong></span><span>Difficulty <strong className="ml-1 font-medium text-[#c4cad1]">{incident.difficulty}</strong></span></div>
      </div>
      <div className="rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-red-300"><CircleAlert size={13} /> Observed error</div><div className="mono mt-1.5 text-xs text-[#d8dce1]">{incident.error}</div></div>
    </div>
    <div className="mb-6 rounded-lg border border-[#2c333d] bg-[#0d1015] p-5"><div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#717a86]">Business impact</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{Object.entries({ "Service impact": incident.businessImpact.serviceImpact, "Estimated affected": incident.businessImpact.estimatedAffectedUsers, "Business impact": incident.businessImpact.businessImpact, Priority: incident.businessImpact.priority, "Revenue impact": incident.businessImpact.revenueImpact }).map(([label, value]) => <div key={label}><div className="mono text-[9px] uppercase tracking-wider text-[#68717d]">{label}</div><p className="mt-1.5 text-xs leading-5 text-[#c3c9d0]">{value}</p></div>)}</div></div>
    <InvestigationWorkspace incident={incident} />
  </main>;
}
