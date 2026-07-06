import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Github } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Support Debugging Lab",
  description: "Investigate realistic AI API, deployment, WordPress, and web infrastructure incidents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-[#242a33] bg-[#090b0e]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 lg:px-8">
            <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-sm text-sm font-semibold tracking-tight">
              <span className="grid size-7 place-items-center rounded-md border border-[#3b4432] bg-[#b7f36b]/10 text-[#b7f36b]"><Activity size={15} /></span>
              AI Support Debugging Lab
            </Link>
            <div className="flex items-center gap-4 text-xs text-[#89919e]">
              <span className="hidden items-center gap-2 sm:flex"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> Systems operational</span>
              <a href="https://github.com/aicee/ai-support-debugging-lab" aria-label="View AI Support Debugging Lab on GitHub" className="focus-ring rounded text-[#89919e] transition hover:text-white"><Github size={17} /></a>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
