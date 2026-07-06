import Link from "next/link";
import { ArrowRight, Boxes, Braces, Gauge, Layers3 } from "lucide-react";
import { IncidentList } from "@/components/incident-list";
import { InteractiveSignalField } from "@/components/interactive-signal-field";
import { incidents } from "@/lib/incidents";

export default function Home() {
  return (
    <main>
      <section className="grid-texture border-b border-[#242a33]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.82fr)] xl:gap-20">
          <div className="max-w-3xl">
            <div className="mono mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b7f36b]"><span className="h-px w-8 bg-[#b7f36b]" /> Production support simulation</div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-6xl">AI Support<br /><span className="text-[#929aa6]">Debugging Lab</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#9ba3ae]">Practice investigating realistic AI voice, API, deployment, and web infrastructure incidents. Follow the evidence, isolate the failure, and communicate the fix.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#incident-queue" className="focus-ring inline-flex items-center gap-2 rounded-md bg-[#b7f36b] px-4 py-2.5 text-sm font-semibold text-[#10140b] transition hover:bg-[#c6ff7e]">Begin Investigation <ArrowRight size={16} /></a><Link href="/project-notes" className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#343c47] bg-[#10141a] px-4 py-2.5 text-sm font-semibold text-[#c2c8d0] transition hover:border-[#525d6a] hover:text-white">View Project Notes <Braces size={15} /></Link></div>
          </div>
          <div className="hidden lg:block"><InteractiveSignalField /></div>
          </div>
          <div className="mt-16 grid max-w-3xl grid-cols-1 divide-y divide-[#242a33] border-y border-[#242a33] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 py-5 sm:pr-7"><Boxes size={17} className="text-[#b7f36b]" /><div><div className="text-lg font-semibold">{incidents.length}</div><div className="text-xs text-[#78818d]">production incidents</div></div></div>
            <div className="flex items-center gap-3 py-5 sm:px-7"><Gauge size={17} className="text-[#b7f36b]" /><div><div className="text-lg font-semibold">3</div><div className="text-xs text-[#78818d]">difficulty levels</div></div></div>
            <div className="flex items-center gap-3 py-5 sm:pl-7"><Layers3 size={17} className="text-[#b7f36b]" /><div><div className="text-lg font-semibold">AI + Web Infra</div><div className="text-xs text-[#78818d]">APIs · Hosting · DNS</div></div></div>
          </div>
        </div>
      </section>
      <section className="border-b border-[#242a33] bg-[#0b0e12]"><div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-8"><div className="mono mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b7f36b]">Built to Demonstrate</div><div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">{["AI API troubleshooting", "ElevenLabs-style voice support", "WordPress and hosting support", "DNS, Cloudflare, and SSL", "Customer communication", "AI-assisted support workflows"].map((item) => <div key={item} className="flex items-center gap-3 border-t border-[#252b34] py-3 text-sm text-[#b4bbc4]"><span className="size-1.5 rounded-full bg-[#b7f36b]" />{item}</div>)}</div></div></section>
      <IncidentList incidents={incidents} />
    </main>
  );
}
