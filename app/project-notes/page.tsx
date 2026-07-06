import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const sections = [
  { title: "Why I built this", body: "Support engineering is difficult to show in a public portfolio because the strongest work happens in private tickets, logs, dashboards, and customer conversations. I built a safe, synthetic environment that makes the investigation process visible without exposing customer data." },
  { title: "What this demonstrates", body: "The lab shows how I move from an ambiguous customer report to an evidence-backed root cause: establish scope, correlate request IDs, compare environments, inspect API behavior, validate the deployment, document the fix, and communicate the result." },
  { title: "Support skills", body: "Incident triage, severity and impact assessment, log analysis, reproduction, root-cause analysis, internal incident reporting, prevention planning, and concise enterprise customer communication." },
  { title: "AI skills", body: "Troubleshooting voice generation, streaming, model compatibility, quota, authentication, conversational-agent tools, webhooks, and binary audio. OpenAI is used server-side to draft customer replies from sanitized investigation findings." },
  { title: "Web infrastructure skills", body: "WordPress, DNS, Cloudflare, hosting, SSL, email delivery, malware response, and website performance investigations grounded in more than 10 years of web hosting support experience." },
  { title: "Deployment skills", body: "Docker and Fly.io operations, ports and health checks, memory constraints, environment isolation, secrets, deployment regressions, safe diagnostics, and production smoke testing." },
  { title: "Future improvements", body: "Persist analyst progress, add team assignment and audit history, introduce webhook replay tools, stream sanitized live logs, add role-based access, and evaluate AI drafts for accuracy and support tone." },
];

export default function ProjectNotesPage() {
  return <main className="mx-auto max-w-[920px] px-5 py-10 lg:px-8 lg:py-16"><Link href="/" className="focus-ring mb-10 inline-flex items-center gap-2 rounded text-xs font-medium text-[#7f8894] transition hover:text-white"><ArrowLeft size={14} /> Back to incident queue</Link><div className="border-b border-[#242a33] pb-10"><div className="mono mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b7f36b]">Project Notes</div><h1 className="text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">Building support reasoning into a portfolio project.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[#9ba3ae]">A short field guide to the decisions, skills, and operational thinking behind AI Support Debugging Lab.</p></div><div className="divide-y divide-[#242a33]">{sections.map((section, index) => <section key={section.title} className="grid gap-4 py-9 sm:grid-cols-[100px_1fr]"><div className="mono text-[10px] text-[#616b77]">0{index + 1}</div><div><h2 className="text-xl font-semibold text-[#e6e9ed]">{section.title}</h2><p className="mt-3 text-sm leading-7 text-[#9da5af]">{section.body}</p></div></section>)}</div></main>;
}
