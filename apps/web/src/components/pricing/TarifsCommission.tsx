import { COMMISSION_BREAKDOWN } from "@/components/pricing/tarifsData";
import { Accent, DisplayTitle } from "@/components/ui/display-title";

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(cx: number, cy: number, r: number, start: number, end: number) {
  const inner = r * 0.62;
  const s1 = polar(cx, cy, r, start);
  const e1 = polar(cx, cy, r, end);
  const s2 = polar(cx, cy, inner, end);
  const e2 = polar(cx, cy, inner, start);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

function CommissionDonut() {
  const cx = 120;
  const cy = 120;
  const r = 104;
  const gap = 2.4;
  let cursor = 0;

  return (
    <svg viewBox="0 0 240 240" className="h-[240px] w-[240px]" aria-hidden>
      {COMMISSION_BREAKDOWN.map((seg) => {
        const sweep = (seg.pct / 100) * 360;
        const start = cursor + gap / 2;
        const end = cursor + sweep - gap / 2;
        cursor += sweep;
        return <path key={seg.label} d={donutSlice(cx, cy, r, start, end)} fill={seg.color} />;
      })}
      <text
        x="120"
        y="116"
        textAnchor="middle"
        className="num"
        fill="#F5EFE6"
        fontSize="22"
        fontFamily="var(--font-mono), monospace"
        fontWeight="500"
      >
        100%
      </text>
      <text
        x="120"
        y="138"
        textAnchor="middle"
        fill="rgba(245,239,230,0.55)"
        fontSize="11"
        fontFamily="var(--font-sans), system-ui, sans-serif"
      >
        de la commission
      </text>
    </svg>
  );
}

export function TarifsCommission() {
  return (
    <section className="bg-ink py-20 text-white md:py-24">
      <div className="landing-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <DisplayTitle as="h2" size="display-2" className="text-white">
            Une commission qui fait <Accent>tourner</Accent> la plateforme.
          </DisplayTitle>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-white/85">
            Notre commission finance la vérification KYC de chaque artisan, le paiement sécurisé, le
            support 7&nbsp;j/7, la médiation en cas de litige, et le développement continu de
            l&apos;application. Elle est prélevée automatiquement lors du paiement client, jamais
            avant.
          </p>
          <ul className="mt-10">
            {COMMISSION_BREAKDOWN.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-0"
              >
                <span className="flex items-center gap-3 text-sm text-white/80">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  {row.label}
                </span>
                <span className="font-mono text-sm text-rust">{row.pct}&nbsp;%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center lg:col-span-5">
          <CommissionDonut />
        </div>
      </div>
    </section>
  );
}
