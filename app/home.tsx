'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, money, phoneDisplay, type Machine, type Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { BrandsLine } from '@/components/site/brands';
import { ReviewSection } from '@/components/site/review';
import { ProductImage } from '@/components/site/product-image';
import { WhatsAppIcon } from '@/components/site/icons';
import { InquiryDialog } from '@/components/site/inquiry-dialog';
import { TechSheetButton } from '@/components/site/tech-sheet-dialog';

const TILE_SIZES = '(max-width: 560px) 45vw, (max-width: 1100px) 30vw, 300px';

/** Filtro por sector. Solo aparece si hay más de un sector que elegir. */
function SectorFilter({ items, value, onChange, label }: { items: Machine[]; value: string; onChange: (v: string) => void; label: string }) {
  const present = categories.filter(c => c === 'Todas' || items.some(m => m.category === c));
  if (present.length < 3) return null;
  return (
    <div className="sector-filter" role="group" aria-label={label}>
      {present.map(c => (
        <button key={c} type="button" aria-pressed={value === c} onClick={() => onChange(c)}>{c}</button>
      ))}
    </div>
  );
}

export default function Home({ machines, referenceMachines, settings }: { machines: Machine[]; referenceMachines: Machine[]; settings: Settings }) {
  const [usedSector, setUsedSector] = useState('Todas');
  const [newSector, setNewSector] = useState('Todas');
  const [ask, setAsk] = useState(false);
  const [askMachines, setAskMachines] = useState<Machine[]>([]);
  const [askSession, setAskSession] = useState(0);
  const used = useMemo(() => machines.filter(m => usedSector === 'Todas' || m.category === usedSector), [machines, usedSector]);
  const models = useMemo(() => referenceMachines.filter(m => newSector === 'Todas' || m.category === newSector), [referenceMachines, newSector]);
  const wa = (text?: string) => whatsappLink(settings, text);
  function openAsk(ms: Machine[] = []) { setAskMachines(ms); setAskSession(s => s + 1); setAsk(true); }

  return (
    <>
      <Header settings={settings} active="machines" />
      <main id="contenido">
        <section className="intro wrap">
          <div className="intro-copy">
            <p className="kicker">{settings.locality} ({settings.region}) · Desde {settings.foundedYear} · Envíos a toda España</p>
            <h1>Maquinaria para obradores, revisada por quien la repara.</h1>
            <p className="lead">
              Reparamos maquinaria de panadería, pastelería y heladería desde {settings.foundedYear}. Cada máquina de segunda mano que vendemos pasa antes por nuestro taller y sale con garantía por escrito.
            </p>
            <div className="actions">
              <a className="btn btn-dark" href="#maquinaria">Ver maquinaria <ArrowRight size={17} aria-hidden="true" /></a>
              {settings.whatsapp && <a className="btn btn-wa-solid" href={wa()} target="_blank" rel="noopener"><WhatsAppIcon /> Escríbenos por WhatsApp</a>}
            </div>
          </div>
          <figure className="poster">
            <div className="poster-label"><span>Cartel de archivo</span><span>c. 1918</span></div>
            <div className="poster-frame">
              <Image src="/images/bread-poster-1918.jpg" alt="Cartel histórico con una hogaza de pan: «Save a loaf a week», de la U.S. Food Administration, hacia 1918" width={2029} height={3000} sizes="(max-width: 860px) 260px, 340px" priority />
            </div>
            <figcaption>«Save a loaf a week». U.S. Food Administration, c. 1918. National Archives, dominio público.</figcaption>
          </figure>
        </section>

        <BrandsLine />

        <section className="doors wrap" aria-labelledby="necesitas-titulo">
          <h2 id="necesitas-titulo">¿Qué necesitas?</h2>
          <ul>
            <li>
              <a href="#maquinaria">
                <span className="door-number" aria-hidden="true">01</span>
                <h3>Comprar una máquina</h3>
                <p>De segunda mano, revisada en nuestro taller, o nueva. Compáralas antes de decidir.</p>
                <span className="door-go">Ver maquinaria <ArrowRight size={15} aria-hidden="true" /></span>
              </a>
            </li>
            <li>
              <Link href="/servicio-tecnico">
                <span className="door-number" aria-hidden="true">02</span>
                <h3>Reparar o mantener</h3>
                <p>Reparación, mantenimiento preventivo y contratos anuales para obradores y cadenas.</p>
                <span className="door-go">Servicio técnico <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            </li>
            <li>
              <Link href="/vender">
                <span className="door-number" aria-hidden="true">03</span>
                <h3>Vender tu máquina</h3>
                <p>La valoramos y te proponemos la mejor forma de venderla.</p>
                <span className="door-go">Vender <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="duel" aria-labelledby="duel-titulo">
          <div className="wrap">
            <div className="duel-head">
              <p className="kicker">Comparador</p>
              <h2 id="duel-titulo">Segunda mano o nueva. Compáralas.</h2>
              <p>Pon una máquina revisada junto a un modelo nuevo y decide con todos los datos delante.</p>
            </div>
            <div className="duel-grid">
              <article>
                <span className="pill pill-used">Segunda mano · Revisada</span>
                <h3>Revisada en nuestro taller</h3>
                <dl>
                  <div><dt>Precio</dt><dd>Cerrado por máquina</dd></div>
                  <div><dt>Entrega</dt><dd>Desde nuestro taller</dd></div>
                  <div><dt>Estado</dt><dd>Revisada y probada</dd></div>
                  <div><dt>Garantía</dt><dd>Por escrito, de Emapan</dd></div>
                </dl>
              </article>
              <span className="duel-vs" aria-hidden="true">vs</span>
              <article>
                <span className="pill pill-new">Nueva · Bajo propuesta</span>
                <h3>Nueva de fábrica</h3>
                <dl>
                  <div><dt>Precio</dt><dd>Bajo propuesta</dd></div>
                  <div><dt>Entrega</dt><dd>Plazo del fabricante</dd></div>
                  <div><dt>Estado</dt><dd>A estrenar</dd></div>
                  <div><dt>Garantía</dt><dd>Del fabricante</dd></div>
                </dl>
              </article>
            </div>
            <div className="actions duel-actions">
              <Link className="btn btn-dark" href="/comparar">Abrir el comparador <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="stock wrap" id="maquinaria" aria-labelledby="usada-titulo">
          <div className="section-head">
            <h2 id="usada-titulo">Maquinaria de segunda mano</h2>
            <p>Revisada en taller · Garantía por escrito · Envío a toda España</p>
          </div>
          {machines.length ? (
            <>
              <SectorFilter items={machines} value={usedSector} onChange={setUsedSector} label="Filtrar maquinaria de segunda mano por sector" />
              <ul className="tile-grid">
                {used.map(m => (
                  <li key={m.id} className="tile">
                    <span className="tile-photo"><ProductImage m={m} sizes={TILE_SIZES} /></span>
                    {m.availability === 'Reservada' && <span className="tile-flag">Reservada</span>}
                    <p className="tile-meta">{m.brand}{m.year ? ` · ${m.year}` : ''}</p>
                    <h3><Link className="tile-link" href={`/maquina/${m.id}`}>{m.model}</Link></h3>
                    <p className="tile-type">{m.type}</p>
                    <p className="tile-price">{m.price === null ? 'Consultar precio' : `${money(m.price)} + IVA`}</p>
                    <Link className="tile-compare" href={`/comparar?ids=${encodeURIComponent(m.id)}`}>Comparar con nueva</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="stock-note">
              <p><strong>Estamos preparando las primeras máquinas.</strong> Si buscas algo concreto, dínoslo y te avisamos cuando entre.</p>
              {settings.whatsapp && <a className="btn btn-outline" href={wa('Hola, vengo de la web y busco una máquina de segunda mano: ')} target="_blank" rel="noopener"><WhatsAppIcon /> Dinos qué buscas</a>}
            </div>
          )}
        </section>

        <section className="stock wrap" aria-labelledby="nueva-titulo">
          <div className="section-head">
            <h2 id="nueva-titulo">Maquinaria nueva</h2>
            <p>Bajo propuesta: precio, configuración y garantía a tu medida.</p>
          </div>
          <SectorFilter items={referenceMachines} value={newSector} onChange={setNewSector} label="Filtrar maquinaria nueva por sector" />
          <ul className="tile-grid">
            {models.map(m => (
              <li key={m.id} className="tile">
                <span className="tile-photo"><ProductImage m={m} sizes={TILE_SIZES} /></span>
                <p className="tile-meta">{m.brand}</p>
                <h3><TechSheetButton className="tile-link" m={m} settings={settings} onAsk={x => openAsk([x])}>{m.model}</TechSheetButton></h3>
                <p className="tile-type">{m.type}</p>
                <p className="tile-more">Ver ficha</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="craft wrap" aria-labelledby="oficio-titulo">
          <figure>
            <Image src="/images/bakery-interior-1900.jpg" alt="Fotografía histórica en blanco y negro de un panadero junto a sus panes y el horno de un obrador, a comienzos del siglo XX" width={2000} height={1537} sizes="(max-width: 860px) 92vw, 620px" />
            <figcaption>«Interior of a bakery», principios del siglo XX. Archives of Ontario, dominio público.</figcaption>
          </figure>
          <div>
            <h2 id="oficio-titulo">Cambian las máquinas.<br />Permanece el oficio.</h2>
            <p>Cada obrador tiene su ritmo. Por eso, antes de recomendarte una máquina, queremos saber qué produces, cuánto espacio tienes y cómo trabajas.</p>
          </div>
        </section>

        <ReviewSection />

        <section className="contact-block" aria-labelledby="contacto-titulo">
          <div className="wrap">
            <h2 id="contacto-titulo">¿Hablamos?</h2>
            <p>Llámanos o escríbenos por WhatsApp, sin compromiso.</p>
            <div className="actions">
              {settings.whatsapp && <a className="btn btn-wa-solid" href={wa()} target="_blank" rel="noopener"><WhatsAppIcon /> WhatsApp</a>}
              {settings.phone && <a className="btn btn-outline" href={`tel:${settings.phone}`}>Llamar al {phoneDisplay(settings.phone)}</a>}
            </div>
            <p className="contact-alt">
              {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
              <span aria-hidden="true"> · </span>
              <button type="button" className="link-button" onClick={() => openAsk()}>Prefiero dejar mis datos</button>
            </p>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      {askSession > 0 && <InquiryDialog key={askSession} open={ask} onOpenChange={setAsk} machines={askMachines} settings={settings} />}
    </>
  );
}
