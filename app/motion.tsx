'use client';
import { useEffect } from 'react';

// Capa de movimiento común a todas las páginas: aparición al hacer scroll,
// cabecera con sombra y barra de progreso. Sin JavaScript todo se ve igual,
// solo que quieto; con «reducir movimiento» no se anima nada.
const REVEAL = [
  '.section-title', '.brands-panel', '.stock-soon', '.machine-card', '.ref-card', '.sell-band',
  '.archive-workshop figure', '.archive-workshop > div', '.proposal-section > div:first-child',
  '.proposal-steps > div', '.sell-hero > div', '.sell-model-grid article', '.commercial-note',
  '.offer-intro', '.offer-form', '.technical', '.compare-title', '.sat-compare-controls',
  '.legal-page h2', '.site-footer > div',
].join(',');

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector('.site-header');
    const bar = document.querySelector<HTMLElement>('.scroll-progress');
    const pending = new Set<HTMLElement>();
    const show = (el: HTMLElement) => { el.classList.add('is-in'); pending.delete(el); };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = root.scrollHeight - root.clientHeight;
        bar?.style.setProperty('--progress', String(max > 0 ? root.scrollTop / max : 0));
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

  return <div className="scroll-progress" aria-hidden="true" />;
}
