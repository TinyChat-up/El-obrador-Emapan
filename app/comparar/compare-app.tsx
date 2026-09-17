'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, CalendarDays, ChevronDown, Cog, Gauge, Layers, PackageCheck, Plug, Ruler, ShieldCheck, Sparkles, Tag, Timer, Truck, Wrench, Zap, type LucideIcon } from 'lucide-react';
import type { Machine, Settings } from '@/lib/catalog';
import { compareSections, initialSelection, priceLabel, type IconName } from '@/lib/compare';
import { whatsappLink } from '@/lib/site';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { ProductImage } from '@/components/site/product-image';
import { WhatsAppIcon } from '@/components/site/icons';
import { InquiryDialog } from '@/components/site/inquiry-dialog';

const ICONS: Record<IconName, LucideIcon> = {
  price: Tag, truck: Truck, stock: PackageCheck, badge: BadgeCheck, calendar: CalendarDays, timer: Timer, sparkles: Sparkles,
  wrench: Wrench, parts: Cog, shield: ShieldCheck, type: Layers, layers: Layers, gauge: Gauge, zap: Zap, plug: Plug, ruler: Ruler,
};

const isUsed = (m: Machine) => m.condition === 'Reacondicionada';

export function ConditionPill({ m }: { m: Machine }) {
  return isUsed(m)
    ? <span className="pill pill-used">Segunda mano<span className="pill-extra"> · Revisada</span></span>
    : <span className="pill pill-new">Nueva<span className="pill-extra"> · Bajo propuesta</span></span>;
}

export default function CompareApp({ machines, referenceMachines, settings, initialCompare }: { machines: Machine[]; referenceMachines: Machine[]; settings: Settings; initialCompare: string[] }) {
  const all = useMemo(() => [...machines, ...referenceMachines], [machines, referenceMachines]);
  const [ids, setIds] = useState(() => initialSelection(machines, referenceMachines, initialCompare));
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [ask, setAsk] = useState(false);
  const [askMachines, setAskMachines] = useState<Machine[]>([]);
  const [askSession, setAskSession] = useState(0);
  const columns = ids.map(id => all.find(m => m.id === id)).filter((m): m is Machine => !!m);

  function choose(index: number, id: string) {
    const next = [...ids];
    next[index] = id;
    setIds(next);
    try { history.replaceState(null, '', `/comparar?ids=${next.map(encodeURIComponent).join(',')}`); } catch {}
  }
  function openAsk(m: Machine) { setAskMachines([m]); setAskSession(s => s + 1); setAsk(true); }

  // Herramienta para asistentes del navegador (WebMCP): prepara una comparación sin pedir presupuestos.
  useEffect(() => {
    const c = (document as unknown as { modelContext?: { registerTool?: (tool: unknown, opts: unknown) => unknown } }).modelContext;
    if (!c?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: 'stage_machine_comparison', title: 'Preparar comparación de máquinas',
      description: 'Selecciona de dos a tres máquinas existentes y muestra su comparación; no solicita presupuestos.',
      inputSchema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 3 } }, required: ['ids'], additionalProperties: false },
      annotations: { readOnlyHint: false },
      execute: async (input: { ids?: unknown }) => {
        const next = input?.ids;
        if (!Array.isArray(next) || next.length < 2 || next.length > 3 || new Set(next).size !== next.length || next.some(id => typeof id !== 'string' || !all.some(m => m.id === id)))
          throw new Error('Selecciona 2 o 3 referencias válidas.');
        setIds(next as string[]);
        return { selected: next, action: 'comparison_staged' };
      },
    };
    try { Promise.resolve(c.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch {}
    return () => lifecycle.abort();
  }, [all]);

  const style = { '--cols': columns.length } as React.CSSProperties;

  return (
    <>
      <Header settings={settings} active="compare" />
      <main id="contenido" className="compare wrap">
        <header className="compare-head">
          <p className="kicker">Comparador</p>
          <h1>Segunda mano o nueva.<br />Compáralas cara a cara.</h1>
          <p className="lead">Pon una máquina revisada en nuestro taller junto a un modelo nuevo y mira qué cambia: precio, estado, garantía y ficha técnica.</p>
        </header>

        {!machines.length && (
          <p className="compare-notice">
            Aún no hay máquinas de segunda mano publicadas, así que de momento puedes comparar modelos nuevos.
            {settings.whatsapp && <> <a href={whatsappLink(settings, 'Hola, vengo del comparador y busco una máquina de segunda mano: ')} target="_blank" rel="noopener">Pídenos una usada por WhatsApp</a>.</>}
          </p>
        )}

        <div className="cmp" style={style}>
          <div className="cmp-row cmp-pickers">
            {columns.map((m, i) => (
              <div className="cmp-cell" key={i}>
                <label className="sr-only" htmlFor={`cmp-${i}`}>Máquina {i + 1}</label>
                <div className="cmp-select">
                  <select id={`cmp-${i}`} value={m.id} onChange={e => choose(i, e.target.value)}>
                    <optgroup label="Segunda mano · revisada">
                      {machines.length
                        ? machines.map(x => <option key={x.id} value={x.id} disabled={ids.includes(x.id) && x.id !== m.id}>{x.brand} {x.model}{x.year ? ` (${x.year})` : ''}</option>)
                        : <option disabled>Próximamente</option>}
                    </optgroup>
                    <optgroup label="Nueva · bajo propuesta">
                      {referenceMachines.map(x => <option key={x.id} value={x.id} disabled={ids.includes(x.id) && x.id !== m.id}>{x.brand} {x.model}</option>)}
                    </optgroup>
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>

          <div className="cmp-row cmp-products">
            {columns.map((m, i) => (
              <div className="cmp-cell cmp-product" key={i}>
                <span className="cmp-photo"><ProductImage m={m} sizes="(max-width: 640px) 44vw, 300px" priority={i === 0} /></span>
                <ConditionPill m={m} />
                <p className="tile-meta">{m.brand}</p>
                <h2>{m.model}</h2>
                <p className="cmp-type">{m.type}</p>
                <p className="cmp-price">{priceLabel(m)}</p>
                {isUsed(m) ? (
                  <>
                    <Link className="btn btn-dark" href={`/maquina/${m.id}`}>Ver máquina</Link>
                    {settings.whatsapp && <a className="cmp-link" href={whatsappLink(settings, `Hola, vengo del comparador y me interesa la ${m.brand} ${m.model}${m.year ? ` (${m.year})` : ''}.`)} target="_blank" rel="noopener"><WhatsAppIcon size={15} /> Preguntar</a>}
                  </>
                ) : (
                  <>
                    {settings.whatsapp && <a className="btn btn-wa-solid" href={whatsappLink(settings, `Hola, vengo del comparador. ¿Me pasáis precio de la ${m.brand} ${m.model} nueva?`)} target="_blank" rel="noopener"><WhatsAppIcon size={16} /> Pedir precio</a>}
                    <button type="button" className="cmp-link" onClick={() => openAsk(m)}>Prefiero dejar mis datos</button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="cmp-sticky" aria-hidden="true">
            <div className="cmp-row">
              {columns.map((m, i) => (
                <div className="cmp-cell" key={i}>
                  <span className={`cmp-dot ${isUsed(m) ? 'is-used' : ''}`} />
                  <span className="cmp-sticky-name">{m.brand} {m.model}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cmp-toolbar">
            <button type="button" className="cmp-toggle" aria-pressed={onlyDifferences} onClick={() => setOnlyDifferences(v => !v)}>
              <span className="cmp-toggle-track" aria-hidden="true"><span /></span>
              Mostrar solo las diferencias
            </button>
          </div>

          {compareSections.map(section => {
            const rows = section.rows
              .map(row => ({ row, values: columns.map(m => row.value(m)) }))
              .filter(({ values }) => !onlyDifferences || new Set(values).size > 1);
            if (!rows.length) return null;
            return (
              <section className="cmp-section" key={section.id} aria-labelledby={`cmp-${section.id}`}>
                <h2 id={`cmp-${section.id}`}>{section.title}</h2>
                {rows.map(({ row, values }) => {
                  const Icon = ICONS[row.icon];
                  const differs = new Set(values).size > 1;
                  return (
                    <div className={`cmp-row cmp-spec ${differs ? 'is-different' : ''}`} key={row.key}>
                      {values.map((value, i) => (
                        <div className="cmp-cell" key={i}>
                          <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                          <p className="cmp-value"><span className="sr-only">{columns[i].brand} {columns[i].model}, {row.label}: </span>{value}</p>
                          <p className="cmp-label" aria-hidden="true">{row.label}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        <p className="compare-foot">
          Precios sin IVA. El envío y la instalación se presupuestan según el destino. Los datos de los modelos nuevos son orientativos del fabricante y se confirman en cada propuesta.
        </p>
      </main>
      <Footer settings={settings} />
      {askSession > 0 && <InquiryDialog key={askSession} open={ask} onOpenChange={setAsk} machines={askMachines} settings={settings} />}
    </>
  );
}
