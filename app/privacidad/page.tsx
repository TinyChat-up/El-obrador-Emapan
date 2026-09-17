import type { Metadata } from 'next';
import { officialBrands, phoneDisplay } from '@/lib/catalog';
import { getSettings } from '@/lib/server';
import { siteUrl } from '@/lib/site';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';

export const metadata: Metadata = {
  title: 'Aviso legal y política de privacidad',
  description: 'Aviso legal (LSSI), política de privacidad (RGPD) y uso de cookies de El Obrador de Emapan, de Emapan S.L.',
  alternates: { canonical: '/privacidad' },
};

const UPDATED = '17 de septiembre de 2026';

export default function Privacy() {
  const s = getSettings();
  const privacyMail = s.privacyEmail || s.email;
  return (
    <>
      <Header settings={s} />
      <main id="contenido" className="wrap legal-page">
        <div className="eyebrow">INFORMACIÓN Y TRANSPARENCIA</div>
        <h1>Aviso legal y política de privacidad.</h1>
        <nav className="legal-toc" aria-label="Contenido de la página">
          <a href="#aviso-legal">Aviso legal</a>
          <a href="#privacidad">Privacidad</a>
          <a href="#cookies">Cookies y analítica</a>
          <a href="#condiciones">Condiciones y marcas</a>
        </nav>

        <h2 id="aviso-legal">1. Aviso legal</h2>
        <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), estos son los datos del titular de este sitio web:</p>
        <dl className="legal-data">
          <div><dt>Titular</dt><dd>{s.legalName}</dd></div>
          <div><dt>Nombre comercial</dt><dd>El Obrador de Emapan</dd></div>
          <div><dt>CIF</dt><dd>{s.taxId}</dd></div>
          <div><dt>Domicilio</dt><dd>{s.address}, España</dd></div>
          <div><dt>Correo electrónico</dt><dd><a href={`mailto:${s.email}`}>{s.email}</a></dd></div>
          {s.phone && <div><dt>Teléfono</dt><dd>{phoneDisplay(s.phone)}</dd></div>}
          <div><dt>Datos registrales</dt><dd>{s.registry}</dd></div>
          <div><dt>Sitio web</dt><dd>{siteUrl().replace(/^https?:\/\//, '')}</dd></div>
        </dl>
        <p>El uso de este sitio atribuye la condición de usuario e implica la aceptación de este aviso legal. El titular puede modificar los contenidos y estas condiciones en cualquier momento.</p>

        <h2 id="privacidad">2. Política de privacidad</h2>
        <h3>Responsable del tratamiento</h3>
        <p>{s.legalName}, CIF {s.taxId}, con domicilio en {s.address}. Contacto para asuntos de privacidad: <a href={`mailto:${privacyMail}`}>{privacyMail}</a>.</p>

        <h3>Qué datos tratamos y para qué</h3>
        <ul>
          <li><strong>Solicitud de propuesta</strong> («Prepara mi propuesta»): nombre, empresa, correo, teléfono, localidad y necesidades. Los usamos para responder a tu consulta y preparar una propuesta de maquinaria, transporte y garantía.</li>
          <li><strong>Valoración de tu máquina</strong> («Vende tu máquina»): tus datos de contacto, los datos de la máquina y sus fotografías. Los usamos para estudiar la máquina y proponerte una modalidad de venta.</li>
          <li><strong>Contacto por teléfono, WhatsApp o correo</strong>: los datos que nos facilites en la conversación, para atenderte.</li>
          <li><strong>Seguridad</strong>: una marca temporal de la dirección IP, que solo se guarda en memoria durante una hora para frenar envíos abusivos de formularios.</li>
        </ul>
        <p>Solo pedimos tu nombre y un medio de contacto. Enviar un formulario no te suscribe a publicidad ni te obliga a comprar o vender.</p>

        <h3>Base jurídica</h3>
        <ul>
          <li>Aplicación de medidas precontractuales a petición tuya (art. 6.1.b del Reglamento (UE) 2016/679, RGPD) para las solicitudes de propuesta, valoración y contacto.</li>
          <li>Interés legítimo (art. 6.1.f RGPD) para proteger los formularios frente a envíos abusivos.</li>
          <li>Cumplimiento de obligaciones legales (art. 6.1.c RGPD) si llegamos a formalizar una compraventa.</li>
        </ul>

        <h3>Cuánto tiempo conservamos los datos</h3>
        <p>Mientras gestionamos tu consulta o valoración y, como máximo, [PENDIENTE: plazo de conservación de consultas no formalizadas, p. ej. 12 meses]. Si se formaliza una relación comercial, durante los plazos que exige la normativa fiscal y mercantil.</p>

        <h3>Quién puede acceder a los datos</h3>
        <p>No cedemos tus datos a terceros salvo obligación legal. Nos ayudan a prestar el servicio, como encargados del tratamiento:</p>
        <ul>
          <li><strong>Vercel Inc.</strong>: alojamiento de la web y analítica anónima.</li>
          <li><strong>Resend</strong>: envío a nuestro correo del aviso de cada solicitud.</li>
          <li><strong>Supabase</strong>: almacenamiento privado de las fotos que envías para valorar una máquina.</li>
          <li><strong>WhatsApp (Meta)</strong>, solo si decides escribirnos por ese canal.</li>
        </ul>
        <p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso, las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en cláusulas contractuales tipo aprobadas por la Comisión Europea. [PENDIENTE: confirmar la región de alojamiento y los acuerdos de encargo firmados con cada proveedor]</p>

        <h3>Tus derechos</h3>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a <a href={`mailto:${privacyMail}`}>{privacyMail}</a> o por correo postal a {s.address}, indicando qué derecho ejerces. Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es/" target="_blank" rel="noopener">www.aepd.es</a>).</p>

        <h2 id="cookies">3. Cookies y analítica</h2>
        <p>Esta web <strong>no utiliza cookies publicitarias ni de seguimiento</strong>, por eso no te mostramos un aviso de cookies.</p>
        <ul>
          <li><strong>Analítica</strong>: usamos Vercel Web Analytics, que no instala cookies ni identifica a las personas. Solo recoge datos agregados y anónimos, como las páginas visitadas, el país o el tipo de dispositivo.</li>
          <li><strong>Comparador</strong>: la selección de máquinas se guarda en el almacenamiento temporal de tu navegador (sessionStorage) y se borra al cerrar la pestaña. Es técnicamente necesaria para que funcione el comparador.</li>
          <li><strong>Vídeos</strong>: si una ficha tiene un vídeo de YouTube, no se carga nada de YouTube hasta que pulsas para verlo. A partir de ese momento se aplica la política de privacidad de Google.</li>
        </ul>

        <h2 id="condiciones">4. Condiciones, fotografías y marcas</h2>
        <p>En esta web no se compra ni se paga nada. El precio, los impuestos, la disponibilidad, la configuración, el transporte, la instalación, el plazo y la garantía se confirman por escrito en cada propuesta. Las tarifas de intermediación de «Vende tu máquina» son orientativas y requieren un acuerdo escrito.</p>
        <p>Las fichas de segunda mano muestran fotografías reales de cada unidad. Los modelos nuevos se ilustran con imágenes de sus fabricantes, que no acreditan el estado ni la configuración de una unidad concreta.</p>
        <p>{s.legalName} es servicio técnico oficial de {officialBrands.join(', ')}. El resto de marcas que aparecen en la web pertenecen a sus titulares, y su mención no implica ninguna relación oficial ni distribución exclusiva.</p>
        <p>Los textos, el diseño y las fotografías propias de esta web pertenecen a {s.legalName}. No se permite reproducirlos sin autorización.</p>

        <p className="legal-updated">Última actualización: {UPDATED}.</p>
      </main>
      <Footer settings={s} />
    </>
  );
}
