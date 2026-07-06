"use client";

import { useState } from "react";
import { AlertTriangle, Check, ChevronRight, Clipboard, ClipboardCheck, Edit3, FlaskConical, Loader2, MessageSquareText, RefreshCw, RotateCcw, Sparkles, Terminal, X } from "lucide-react";
import type { Incident } from "@/lib/types";
import { Badge } from "./badge";

const tabs = ["Customer", "Logs", "API Request", "API Response", "Deployment", "Environment", "Timeline", "Notes"] as const;
type Tab = (typeof tabs)[number];

const tabLabel = (incident: Incident, tab: Tab) => {
  if (tab === "API Request" && incident.requestDetails) return "Request Details";
  if (tab === "API Response" && incident.observedError) return "Observed Error";
  return tab;
};

function Evidence({ incident, active }: { incident: Incident; active: Tab }) {
  if (active === "Customer") return <div className="space-y-7"><div><div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#69727e]">Customer message</div><blockquote className="whitespace-pre-line border-l-2 border-[#b7f36b] pl-4 text-sm leading-7 text-[#d9dde2]">{incident.customerMessage}</blockquote></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries({ Customer: incident.customerContext.customer, Plan: incident.customerContext.plan, Environment: incident.customerContext.environment, "Affected users": incident.customerContext.affectedUsers, Region: incident.customerContext.region, Started: incident.customerContext.started }).map(([label, value]) => <div key={label} className="rounded-md border border-[#242b34] bg-[#0a0d11] p-3"><div className="mono text-[9px] uppercase tracking-wider text-[#68717d]">{label}</div><div className="mt-1.5 text-xs font-medium text-[#d2d7dd]">{value}</div></div>)}</div><div><div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#69727e]">Reported impact</div><p className="text-sm leading-6 text-[#aab1bb]">{incident.customerImpact}</p></div></div>;
  if (active === "Timeline") return <div className="space-y-0">{incident.timeline.map((item, index) => <div key={item.time} className="relative flex gap-4 pb-7 last:pb-0"><div className="relative z-10 mt-1.5 size-2 shrink-0 rounded-full bg-[#b7f36b] shadow-[0_0_0_4px_rgba(183,243,107,.08)]" />{index < incident.timeline.length - 1 && <div className="absolute left-[3px] top-4 h-full w-px bg-[#2b313a]" />}<div><div className="mono text-[11px] text-[#77808c]">{item.time}</div><div className="mt-1 text-sm text-[#d7dbe0]">{item.event}</div></div></div>)}</div>;
  if (active === "Notes") return <div><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#69727e]"><ClipboardCheck size={14} /> Support note</div><p className="max-w-3xl text-sm leading-7 text-[#b4bbc4]">{incident.notes}</p></div>;
  const content = { Logs: incident.logs, "API Request": incident.requestDetails ?? incident.apiRequest, "API Response": incident.observedError ?? incident.apiResponse, Deployment: incident.deploymentDetails, Environment: incident.environmentDetails }[active];
  return <pre className="scrollbar min-h-60 overflow-auto whitespace-pre-wrap break-words rounded-md border border-[#242b34] bg-[#080a0d] p-5 text-[12px] leading-6 text-[#b8c0ca]"><code>{content}</code></pre>;
}

function Diagnostic({ provider }: { provider: "elevenlabs" | "openai" }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const run = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/check-${provider}`);
      setResult(await response.json());
    } catch {
      setResult({ status: "error", diagnosticMessage: "The local diagnostic endpoint could not be reached." });
    } finally { setLoading(false); }
  };
  return <div className="mt-6 rounded-lg border border-[#2b323c] bg-[#0b0e12] p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-xs font-semibold text-[#d9dee4]"><FlaskConical size={14} className="text-[#b7f36b]" /> Provider diagnostic</div><p className="mt-1 text-xs text-[#747d89]">Safe credential check. Secret values are never returned.</p></div><button onClick={run} disabled={loading} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-[#38404b] bg-[#151a20] px-3 py-2 text-xs font-semibold text-[#d6dbe1] transition hover:border-[#596471] disabled:opacity-60">{loading ? <Loader2 size={13} className="animate-spin" /> : <Terminal size={13} />} Run diagnostic</button></div>{result && <pre className="scrollbar mt-4 overflow-auto rounded border border-[#252c35] bg-[#07090b] p-4 text-[11px] leading-5 text-[#aeb7c2]">{JSON.stringify(result, null, 2)}</pre>}</div>;
}

export function InvestigationWorkspace({ incident }: { incident: Incident }) {
  const [active, setActive] = useState<Tab>("Customer");
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reply, setReply] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const correct = selected === incident.correctAnswer;
  const submit = () => { if (selected !== null) { setSubmitted(true); setTimeout(() => document.getElementById("summary")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); } };
  const reset = () => { setSelected(null); setSubmitted(false); };
  const generateReply = async () => {
    setReplyOpen(true); setGenerating(true); setReplyError(""); setEditing(false);
    try {
      const response = await fetch("/api/generate-customer-reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerMessage: incident.customerMessage, incident: { id: incident.incidentId, title: incident.title, product: incident.product, severity: incident.severity, context: incident.customerContext, impact: incident.businessImpact }, logs: incident.logs, apiResponse: incident.observedError ?? incident.apiResponse, rootCause: incident.investigationSummary.rootCause, resolution: incident.investigationSummary.resolution }) });
      const data = await response.json() as { reply?: string; message?: string };
      if (!response.ok || !data.reply) throw new Error(data.message || "The reply could not be generated right now.");
      setReply(data.reply);
    } catch (error) { setReplyError(error instanceof Error ? error.message : "The reply could not be generated right now."); }
    finally { setGenerating(false); }
  };
  const copyReply = async () => { await navigator.clipboard.writeText(reply); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <>
      <section className="panel overflow-hidden rounded-lg">
        <div className="scrollbar flex overflow-x-auto border-b border-[#242a33] bg-[#0b0e12] px-2">
          {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`focus-ring relative shrink-0 px-4 py-3.5 text-xs font-medium transition ${active === tab ? "text-white" : "text-[#747d89] hover:text-[#c4cad1]"}`}>{tabLabel(incident, tab)}{active === tab && <span className="absolute inset-x-3 bottom-0 h-px bg-[#b7f36b]" />}</button>)}
        </div>
        <div className="min-h-[340px] p-5 sm:p-7"><Evidence incident={incident} active={active} /></div>
      </section>

      {incident.diagnosticProvider && <Diagnostic provider={incident.diagnosticProvider} />}

      <section className="panel mt-6 rounded-lg p-5 sm:p-7">
        <div className="mb-2 flex items-center gap-2"><AlertTriangle size={15} className="text-[#b7f36b]" /><span className="mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b7f36b]">Root Cause Analysis</span></div>
        <h2 className="text-xl font-semibold tracking-tight">What is the most likely cause?</h2>
        <p className="mt-2 text-sm text-[#7f8894]">Use the evidence above. Choose the explanation that accounts for the full failure pattern.</p>
        <div className="mt-6 grid gap-3">
          {incident.choices.map((choice, index) => {
            const isSelected = selected === index;
            const answerState = submitted && (index === incident.correctAnswer ? "correct" : isSelected ? "wrong" : "idle");
            return <button key={choice} disabled={submitted} onClick={() => setSelected(index)} className={`focus-ring flex items-center gap-3 rounded-md border p-4 text-left text-sm transition ${answerState === "correct" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100" : answerState === "wrong" ? "border-red-500/50 bg-red-500/10 text-red-100" : isSelected ? "border-[#b7f36b]/60 bg-[#b7f36b]/8 text-white" : "border-[#29303a] bg-[#0b0e12] text-[#aeb5be] hover:border-[#414a56] hover:text-white"}`}><span className={`mono grid size-6 shrink-0 place-items-center rounded border text-[10px] ${isSelected ? "border-[#b7f36b]/50 text-[#b7f36b]" : "border-[#343c47] text-[#737c88]"}`}>{String.fromCharCode(65 + index)}</span><span className="flex-1">{choice}</span>{answerState === "correct" && <Check size={16} />}{answerState === "wrong" && <X size={16} />}</button>;
          })}
        </div>
        <div className="mt-5 flex justify-end">{submitted ? <button onClick={reset} className="focus-ring flex items-center gap-2 rounded-md border border-[#333b46] px-4 py-2.5 text-xs font-semibold text-[#b5bdc7] hover:text-white"><RotateCcw size={14} /> Review again</button> : <button onClick={submit} disabled={selected === null} className="focus-ring flex items-center gap-2 rounded-md bg-[#b7f36b] px-4 py-2.5 text-sm font-semibold text-[#10140b] transition hover:bg-[#c6ff7e] disabled:cursor-not-allowed disabled:opacity-35">Submit analysis <ChevronRight size={15} /></button>}</div>
      </section>

      {submitted && <section id="summary" className="mt-6 scroll-mt-20 overflow-hidden rounded-lg border border-[#33402d] bg-[#0e130d]">
        <div className="flex items-center gap-3 border-b border-[#2a3526] px-5 py-4 sm:px-7"><span className={`grid size-8 place-items-center rounded-full ${correct ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{correct ? <Check size={17} /> : <AlertTriangle size={17} />}</span><div><div className="text-sm font-semibold text-white">{correct ? "Analysis confirmed" : "Review the evidence"}</div><div className="text-xs text-[#85907f]">{correct ? "Your diagnosis matches the incident findings." : "The report below explains the evidence-supported cause."}</div></div></div>
        <div className="p-5 sm:p-7">
          <div className="mono mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b7f36b]">Investigation Summary</div>
          <h2 className="text-2xl font-semibold tracking-tight">Incident report</h2>
          <div className="mt-7 grid gap-x-10 gap-y-7 lg:grid-cols-2">
            <ReportItem label="Root Cause" value={incident.investigationSummary.rootCause} />
            <ReportItem label="Impact" value={incident.investigationSummary.impact} />
            <div><ReportLabel>Evidence</ReportLabel><ul className="space-y-2">{incident.investigationSummary.evidence.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-[#b7beb4]"><span className="mt-2.5 size-1 shrink-0 rounded-full bg-[#b7f36b]" />{item}</li>)}</ul></div>
            <ReportItem label="Resolution" value={incident.investigationSummary.resolution} />
            <ReportItem label="Prevention" value={incident.prevention} />
            <ReportItem label="Technical reasoning" value={incident.explanation} />
          </div>
        </div>
      </section>}

      {submitted && <section className="panel mt-6 rounded-lg p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="mono mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b7f36b]">Investigation Complete</div><h2 className="text-xl font-semibold tracking-tight">Actions</h2><p className="mt-1 text-sm text-[#7f8894]">Turn the technical findings into a concise, customer-ready update.</p></div><button onClick={generateReply} disabled={generating} className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#b7f36b] px-4 py-2.5 text-sm font-semibold text-[#10140b] transition hover:bg-[#c6ff7e] disabled:opacity-60">{generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Generate Customer Reply</button></div>
      </section>}

      {submitted && replyOpen && <section className="mt-6 overflow-hidden rounded-lg border border-[#2d3742] bg-[#0d1116]">
        <div className="flex items-center gap-2 border-b border-[#252c35] px-5 py-4 sm:px-7"><MessageSquareText size={16} className="text-[#b7f36b]" /><h2 className="text-sm font-semibold">Customer Reply</h2><span className="mono ml-auto text-[9px] uppercase tracking-wider text-[#65707c]">AI-assisted · analyst reviewed</span></div>
        <div className="p-5 sm:p-7">
          {generating && <div className="flex min-h-44 items-center justify-center gap-3 text-sm text-[#8e97a2]"><Loader2 size={17} className="animate-spin text-[#b7f36b]" /> Drafting a customer-safe response…</div>}
          {!generating && replyError && <div className="rounded-md border border-amber-500/25 bg-amber-500/5 p-4 text-sm leading-6 text-amber-100"><div className="font-semibold">Reply generation is unavailable</div><p className="mt-1 text-amber-100/70">{replyError}</p></div>}
          {!generating && reply && <>{editing ? <textarea aria-label="Edit customer reply" value={reply} onChange={(event) => setReply(event.target.value)} className="focus-ring min-h-72 w-full resize-y rounded-md border border-[#313a45] bg-[#080b0f] p-4 text-sm leading-7 text-[#d8dde3] outline-none" /> : <div className="whitespace-pre-wrap rounded-md border border-[#242c35] bg-[#090c10] p-5 text-sm leading-7 text-[#d8dde3]">{reply}</div>}<div className="mt-4 flex flex-wrap gap-2"><button onClick={copyReply} className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#333d48] px-3 py-2 text-xs font-semibold text-[#c1c8d0] hover:text-white">{copied ? <Check size={13} /> : <Clipboard size={13} />}{copied ? "Copied" : "Copy Reply"}</button><button onClick={() => setEditing((value) => !value)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#333d48] px-3 py-2 text-xs font-semibold text-[#c1c8d0] hover:text-white"><Edit3 size={13} />{editing ? "Done Editing" : "Edit Reply"}</button><button onClick={generateReply} disabled={generating} className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#333d48] px-3 py-2 text-xs font-semibold text-[#c1c8d0] hover:text-white"><RefreshCw size={13} /> Regenerate</button></div></>}
        </div>
      </section>}
    </>
  );
}

function ReportLabel({ children }: { children: React.ReactNode }) { return <div className="mono mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#778273]">{children}</div>; }
function ReportItem({ label, value }: { label: string; value: string }) { return <div><ReportLabel>{label}</ReportLabel><p className="text-sm leading-6 text-[#b7beb4]">{value}</p></div>; }
