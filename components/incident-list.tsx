"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Incident } from "@/lib/types";
import { IncidentCard } from "./incident-card";

const productOptions = ["All", "ElevenLabs", "OpenAI", "Fly.io", "WordPress", "DNS", "Cloudflare", "Hosting", "SSL", "Email", "Malware", "Performance", "Internal API"];

const productGroup = (product: string) => {
  if (product.startsWith("ElevenLabs") || product === "Conversational AI") return "ElevenLabs";
  return product;
};

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [product, setProduct] = useState("All");
  const filtered = useMemo(() => incidents.filter((item) => {
    const haystack = `${item.title} ${item.product} ${item.category} ${item.incidentId}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (difficulty === "All Levels" || item.difficulty === difficulty) && (product === "All" || productGroup(item.product) === product);
  }), [difficulty, incidents, product, query]);

  return (
    <section id="incident-queue" className="mx-auto max-w-[1440px] px-5 py-16 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><div className="mono mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b7f36b]">Active queue</div><h2 className="text-2xl font-semibold tracking-tight">Incident investigations</h2></div>
        <span className="mono text-xs text-[#707986]">{filtered.length} of {incidents.length} records</span>
      </div>
      <div className="panel mb-6 flex flex-col gap-3 rounded-lg p-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-md border border-[#242a33] bg-[#0a0d11] px-3">
          <Search size={15} className="text-[#68717e]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents, products, or categories…" className="focus-ring h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-[#59616d]" />
        </label>
        <label className="flex items-center gap-2 rounded-md border border-[#242a33] bg-[#0a0d11] px-3 text-xs text-[#89919e]">
          <SlidersHorizontal size={14} />
          <select aria-label="Filter by product" value={product} onChange={(event) => setProduct(event.target.value)} className="focus-ring h-10 bg-transparent pr-4 text-xs text-[#c7cdd5] outline-none">
            {productOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-md border border-[#242a33] bg-[#0a0d11] px-3 text-xs text-[#89919e]">
          <SlidersHorizontal size={14} />
          <select aria-label="Filter by level" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="focus-ring h-10 bg-transparent pr-4 text-xs text-[#c7cdd5] outline-none">
            {['All Levels', 'Foundational', 'Operational', 'Escalation'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((incident) => <IncidentCard key={incident.id} incident={incident} />)}</div>
      {filtered.length === 0 && <div className="panel rounded-lg py-14 text-center text-sm text-[#89919e]">No incidents match this view.</div>}
    </section>
  );
}
