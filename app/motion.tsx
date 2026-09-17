'use client';
import { useEffect } from 'react';

// Capa de movimiento común a todas las páginas: aparición suave al hacer
// scroll y cabecera con sombra. Sin JavaScript todo se ve igual,
// solo que quieto; con «reducir movimiento» no se anima nada.
const REVEAL = [
  '.brands-line li', '.doors li', '.duel article', '.detail-compare', '.cmp-section', '.section-head', '.tile', '.stock-note', '.craft > *', '.review-inner > *',
  '.contact-block .wrap > *', '.used-block', '.sell-hero > div', '.sell-model-grid article',
  '.commercial-note', '.offer-intro', '.offer-form', '.compare-title', '.sat-compare-controls',
  '.legal-page h2',
].join(',');

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector('.masthead');
    const pending = new Set<HTMLElement>();
    const show = (el: HTMLElement) => { el.classList.add('is-in'); pending.delete(el); };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        header?.classList.toggle('is-scrolled', root.scrollTop > 8);
        // Red de seguridad: un salto de ancla o un scroll muy rápido no deja nada oculto.
        for (const el of pending) if (el.getBoundingClientRect().top < window.innerHeight) show(el);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))
      return () => window.removeEventListener('scroll', onScroll);

    const io = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        show(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    // Lo que ya está en pantalla al cargar no se esconde: evita el parpadeo.
    const seen = new WeakSet<Element>();
    const register = () => {
      document.querySelectorAll<HTMLElement>(REVEAL).forEach(el => {
        if (seen.has(el) || el.classList.contains('is-in') || el.closest('[role=dialog]')) return;
        seen.add(el);
        const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.matches(REVEAL)) : [];
        el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
        el.dataset.reveal = '';
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
        else { pending.add(el); io.observe(el); }
      });
    };
    register();
    root.classList.add('motion-ready');
    const mo = new MutationObserver(() => register());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

// Sello de confirmación: el círculo y la marca se dibujan y saltan unas chispas.
export function SuccessMark() {
  return (
    <span className="success-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" />
        <path d="M19 33.5l9 9 18-19" />
      </svg>
      {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` } as React.CSSProperties} />)}
    </span>
  );
}
