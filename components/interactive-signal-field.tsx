"use client";

import { useState, type PointerEvent } from "react";

const columns = 18;
const rows = 12;

const signals = [
  { x: 3.2, y: 2.4, label: "DNS", detail: "resolver path" },
  { x: 12.8, y: 2.8, label: "API", detail: "response trace" },
  { x: 8.1, y: 5.8, label: "ORIGIN", detail: "health signal" },
  { x: 14.2, y: 8.4, label: "SSL", detail: "chain verified" },
  { x: 4.8, y: 9.2, label: "LOGS", detail: "evidence stream" },
];

const cells = Array.from({ length: columns * rows }, (_, index) => ({
  index,
  x: index % columns,
  y: Math.floor(index / columns),
  base: 0.035 + ((index * 29) % 9) * 0.012,
  delay: `${-((index * 37) % 160) / 10}s`,
  shape: index % 5 === 0
    ? "polygon(12% 0, 100% 8%, 88% 100%, 0 86%)"
    : index % 7 === 0
      ? "polygon(0 14%, 84% 0, 100% 86%, 16% 100%)"
      : "polygon(4% 4%, 96% 0, 100% 96%, 0 100%)",
}));

export function InteractiveSignalField() {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPoint({
      x: ((event.clientX - bounds.left) / bounds.width) * columns,
      y: ((event.clientY - bounds.top) / bounds.height) * rows,
    });
  };

  return (
    <div className="relative mx-auto aspect-[1.16/1] w-full max-w-[560px]" aria-label="Interactive diagnostic signal map. Move the pointer across the field to reveal infrastructure signals." role="img">
      <div
        className="signal-field absolute inset-0 overflow-hidden"
        onPointerMove={trackPointer}
        onPointerLeave={() => setPoint(null)}
      >
        <svg className="absolute inset-0 size-full opacity-70" viewBox="0 0 180 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M32 24 L81 58 L128 28 L142 84 L48 92 L81 58" fill="none" stroke="rgba(183,243,107,.18)" strokeWidth=".45" />
          <path d="M32 24 L48 92 M128 28 L48 92" fill="none" stroke="rgba(137,145,158,.12)" strokeWidth=".35" strokeDasharray="2 3" />
          {signals.map((signal) => <circle key={signal.label} cx={signal.x * 10} cy={signal.y * 10} r="1.2" fill="#b7f36b" opacity=".55" />)}
        </svg>

        <div className="absolute inset-0 grid gap-[2px] p-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }} aria-hidden="true">
          {cells.map((cell) => {
            const distance = point ? Math.hypot(cell.x + 0.5 - point.x, cell.y + 0.5 - point.y) : 99;
            const proximity = Math.max(0, 1 - distance / 4.1);
            const hot = proximity * proximity;
            return <span
              key={cell.index}
              className="signal-cell border"
              style={{
                "--cell-base": cell.base,
                animationDelay: cell.delay,
                backgroundColor: `rgba(183, 243, 107, ${cell.base + hot * 0.62})`,
                borderColor: `rgba(183, 243, 107, ${0.025 + hot * 0.34})`,
                boxShadow: hot > 0.55 ? `0 0 ${Math.round(hot * 16)}px rgba(183,243,107,${hot * 0.18})` : "none",
                clipPath: cell.shape,
                transform: `scale(${0.88 + hot * 0.16}) rotate(${(cell.index % 3 - 1) * hot * 1.4}deg)`,
              } as React.CSSProperties}
            />;
          })}
        </div>

        {signals.map((signal) => {
          const distance = point ? Math.hypot(signal.x - point.x, signal.y - point.y) : 99;
          const revealed = Math.max(0, 1 - distance / 4.2);
          return <div key={signal.label} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition duration-200" style={{ left: `${(signal.x / columns) * 100}%`, top: `${(signal.y / rows) * 100}%`, opacity: point ? 0.13 + revealed * 0.87 : 0.18, transform: `translate(-50%, -50%) scale(${0.92 + revealed * 0.08})` }}>
            <div className="rounded-sm border border-[#b7f36b]/25 bg-[#0a0e0b]/90 px-2.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,.45)]">
              <div className="mono text-[9px] font-semibold tracking-[0.15em] text-[#b7f36b]">{signal.label}</div>
              <div className="mono mt-1 whitespace-nowrap text-[7px] uppercase tracking-[0.12em] text-[#778273]">{signal.detail}</div>
            </div>
          </div>;
        })}

        {point && <div className="pointer-events-none absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b7f36b]/20 shadow-[0_0_45px_rgba(183,243,107,.12)]" style={{ left: `${(point.x / columns) * 100}%`, top: `${(point.y / rows) * 100}%` }} />}
        <div className="signal-scanline pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b7f36b]/40 to-transparent" />
      </div>
    </div>
  );
}
