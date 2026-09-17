export type Photo={url:string;label:string;kind:'exterior'|'interior'|'detail'};
export type Machine={id:string;brand:string;model:string;comparisonKey?:string;type:string;category:string;condition:'Nueva'|'Reacondicionada';description:string;functioning:string;images:Photo[];year:number|null;price:number|null;capacity:string;power:string;dimensions:string;voltage:string;warranty:string;leadTime:string;inspection:string;workDone:string;defects:string;life:string;availability:string;isDemo:boolean;published:boolean;
 /** Solo para uso interno (de dónde salen los datos). No se muestra en la web. */
 source:string};
export type Settings={brand:string;email:string;whatsapp:string;phone:string;legalName:string;taxId:string;address:string;streetAddress:string;postalCode:string;locality:string;region:string;registry:string;foundedYear:number;openingHours:string;coverage:string;privacyEmail:string;showDemo:boolean;liveInquiries:boolean};

// ─── DATOS DE TU EMPRESA ─────────────────────────────────────────────────
// Edita aquí y haz push. Todo lo que aparece como [PENDIENTE: …] se ve tal
// cual en la web hasta que lo sustituyas por el dato real.
// email, whatsapp y liveInquiries pueden dejarse vacíos aquí y fijarse con
// las variables NOTIFICATION_EMAIL, WHATSAPP_NUMBER y LIVE_INQUIRIES.
export const settings:Settings={
 brand:'El Obrador de Emapan S.L.',
 legalName:'Emapan S.L.',
 taxId:'B53599692',
 address:'C. los Luceros, 8, 03600 Elda, Alicante',
 streetAddress:'C. los Luceros, 8',
 postalCode:'03600',
 locality:'Elda',
 region:'Alicante',
 // Datos del Registro Mercantil (tomo, folio, hoja). Los exige la LSSI.
 registry:'[PENDIENTE: datos de inscripción en el Registro Mercantil de Alicante (tomo, folio, hoja)]',
 foundedYear:1999,
 email:'emapan2@hotmail.com',       // correo de contacto que ve el cliente
 privacyEmail:'emapan2@hotmail.com', // correo para asuntos de privacidad
 whatsapp:'34615619104',            // internacional sin + ni espacios
 phone:'+34615619104',              // con prefijo, sin espacios
 openingHours:'[PENDIENTE: horario de atención]',
 coverage:'[PENDIENTE: zona de cobertura del servicio técnico, p. ej. provincia de Alicante y Región de Murcia]',
 showDemo:false,
 liveInquiries:true,       // true cuando quieras recibir solicitudes reales
};

/** Garantía de las máquinas de segunda mano. Se muestra en portada y en cada ficha. */
export const warranty='[PENDIENTE: duración y cobertura de la garantía, p. ej. 6 meses en piezas y mano de obra]';

/** Foto real del taller o del equipo para la portada. Guárdala en public/images/ y pon aquí su ruta, p. ej. '/images/taller-emapan.jpg'. */
export const workshopPhoto={src:'',alt:'Equipo técnico de Emapan revisando una máquina en el taller de Elda (Alicante)'};

// Marcas de las que Emapan hace servicio técnico. Se muestran en este orden.
export const serviceBrands=['LABUS','IFI','WIESHEU','Carpigiani','Roboqbo','Mondial Forni','FM'];
export const partnerBrands=serviceBrands;
export const categories=['Todas','Panadería','Heladería','Pastelería','Hostelería'];
export const money=(n:number|null)=>n===null?'A presupuestar':new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
export const phoneDisplay=(p:string)=>p.replace(/^\+34/,'').replace(/(\d{3})(\d{2})(\d{2})(\d{2})/,'$1 $2 $3 $4');
export const blankMachine:Machine={id:'',brand:'',model:'',comparisonKey:'',type:'',category:'Panadería',condition:'Reacondicionada',description:'',functioning:'',images:[],year:null,price:null,capacity:'',power:'',dimensions:'',voltage:'',warranty:'Por concretar en la propuesta',leadTime:'Por confirmar',inspection:'Pendiente de informe técnico',workDone:'',defects:'Pendiente de revisión',life:'No evaluada. Depende del uso, el mantenimiento y el estado técnico.',availability:'Por confirmar',isDemo:false,published:false,source:''};

// ─── MODELOS NUEVOS DE REFERENCIA (bajo propuesta) ───────────────────────
// Las imágenes son del fabricante: ver README, apartado «Imágenes».
const reference=(id:string,brand:string,model:string,type:string,category:string,img:string,description:string,source:string):Machine=>({...blankMachine,id,brand,model,type,category,condition:'Nueva',description,functioning:description,images:[{url:'/images/'+img,label:`${brand} ${model}, ${type.toLowerCase()} nuevo · imagen del fabricante`,kind:'exterior'}],source,isDemo:true,published:true,availability:'Bajo propuesta',warranty:'Garantía del fabricante, concretada en la propuesta',inspection:'Máquina nueva',defects:'No aplica: máquina nueva',life:'Máquina nueva'});
const domino=reference('demo-domino','Mondial Forni','Domino','Horno eléctrico modular','Panadería','mondial-domino.png','Cocción por pisos con cámaras independientes. Una solución modular que se adapta al ritmo de tu obrador.','https://www.mondialforni.com/en/commercial-electric-oven-domino.htm');
const lab=reference('demo-labotronic','Carpigiani','Labotronic HE-I','Mantecadora profesional','Heladería','carpigiani-labotronic-full.jpg','Transforma la mezcla en helado mediante enfriamiento y agitación controlados. Modelo de referencia 20/90 HE-I; configuración por confirmar.','Fotografía de distribuidor, ver SOURCES.md');
export const demos:Machine[]=[domino,lab,reference('demo-pastomaster','Carpigiani','Pastomaster 60 HE','Pasteurizador profesional','Heladería','carpigiani-pastomaster.jpg','Tratamiento térmico de mezclas para helado. Configuración y ficha técnica a confirmar en la propuesta.','Fotografía de distribuidor, ver SOURCES.md'),reference('demo-techno','Mondial Forni','Techno','Horno de carro rotativo','Panadería','mondial-techno.png','Cocción con carro rotativo para panadería y pastelería. La gama ofrece variantes eléctricas y de combustión.','https://www.mondialforni.com/en/commercial-electric-oven-techno.htm'),reference('demo-slim','Mondial Forni','Slim','Horno rotativo compacto','Pastelería','mondial-slim.png','Un horno rotativo de formato compacto para obradores con espacio limitado. Bandejas de 40 × 60 cm según configuración.','https://www.mondialforni.com/en/commercial-electric-oven-slim.htm')];
const qbo15=reference('demo-roboqbo-qbo15','Roboqbo','Qbo 15','Sistema de procesado multifunción','Pastelería','roboqbo-qbo15.jpg','Equipo de procesado para cocinar, mezclar y transformar elaboraciones. Configuración y accesorios a concretar para cada proyecto.','https://www.roboqbo.it/en/prodotto/qbo-15/');
qbo15.capacity='Cuba de 15 litros · ficha del fabricante';
qbo15.voltage='Trifásica 400 / 220 / 200 V · 50/60 Hz · según versión';
qbo15.dimensions='1240 × 997 × 1381 mm (ancho × fondo × alto)';
qbo15.functioning='Procesado en cuba de acero AISI 316L, temperatura máxima de 120 °C, vacío máximo de −980 mbar y velocidad variable de 30 a 3000 rpm. Configuración y accesorios a confirmar.';
qbo15.images.push({url:'/images/roboqbo-interior.jpg',label:'Interior de la cuba de un Roboqbo de la gama Qbo en funcionamiento · imagen del fabricante',kind:'interior'});
demos.push(
 reference('demo-labus-abv','LABUS','ABV','Amasadora de brazos verticales','Panadería','labus-abv.jpg','Amasadora de brazos verticales para la preparación de masas. Modelo de referencia de la gama ABV de LABUS; capacidad y versión a confirmar.','https://labus.es/producto/amasadora-mixer/'),
 qbo15,
 {...reference('demo-fm-stb606','FM','STB 606 V7','Horno mixto de panadería','Panadería','fm-stb606.png','Horno eléctrico mixto para panadería con control táctil. La configuración de accesorios, instalación y servicio se concreta en la propuesta.','https://fmindustrial.es/producto/stb-606-v7/'),capacity:'6 bandejas 600 × 400 mm / GN 1/1 · ficha del fabricante',power:'10,65 kW · ficha del fabricante',voltage:'400 V · trifásica · 50/60 Hz',dimensions:'880 × 955 × 835 mm (ancho × fondo × alto) · ficha del fabricante'},
 reference('demo-wiesheu-dibas','WIESHEU','Dibas blue²','Horno de convección para punto de venta','Panadería','wiesheu-dibas.png','Horno de convección con puerta que se recoge lateralmente. La imagen ilustra una combinación de hornos y carro; los elementos incluidos se definirán en la propuesta.','https://www.wiesheu.de/produkte/ladenbackoefen/dibas-blue')
);
const esedra=reference('demo-ifi-esedra','IFI','Esedra','Vitrina refrigerada de exposición','Heladería','ifi-esedra.jpg','Vitrina de exposición para heladería y pastelería. Las versiones, acabados y medidas se seleccionan según el producto y el espacio del establecimiento.','https://www.ifi.it/en/products/esedra/');
demos.push(esedra);
export function normalizeComparisonKey(value:string){return value.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
export function machineComparisonKey(machine:Machine){return normalizeComparisonKey(machine.comparisonKey?.trim()||`${machine.brand} ${machine.model}`);}
export function comparisonRows(ms:Machine[]){return [
 {group:'Inversión',label:'Precio de la máquina',values:ms.map(m=>money(m.price))},
 {group:'Inversión',label:'Envío e instalación',values:ms.map(()=> 'Se calculan para tu ubicación')},
 {group:'La máquina',label:'Estado',values:ms.map(m=>m.condition==='Nueva'?'Nueva · bajo propuesta':'Segunda mano · revisada')},
 {group:'La máquina',label:'Año de fabricación',values:ms.map(m=>m.year?String(m.year):'Sin confirmar')},
 {group:'La máquina',label:'Antigüedad',values:ms.map(m=>m.year?`${Math.max(0,new Date().getFullYear()-m.year)} años`:'Sin confirmar')},
 {group:'La máquina',label:'Funcionamiento',values:ms.map(m=>m.functioning||'Por documentar')},
 {group:'Rendimiento',label:'Capacidad',values:ms.map(m=>m.capacity||'Según configuración')},
 {group:'Rendimiento',label:'Potencia',values:ms.map(m=>m.power||'Sin confirmar')},
 {group:'Rendimiento',label:'Alimentación eléctrica',values:ms.map(m=>m.voltage||'Sin confirmar')},
 {group:'Rendimiento',label:'Dimensiones',values:ms.map(m=>m.dimensions||'Sin confirmar')},
 {group:'Estado y respaldo',label:'Revisión técnica',values:ms.map(m=>m.inspection)},
 {group:'Estado y respaldo',label:'Trabajos realizados',values:ms.map(m=>m.workDone|| (m.condition==='Nueva'?'No aplica':'Por documentar'))},
 {group:'Estado y respaldo',label:'Defectos conocidos',values:ms.map(m=>m.defects)},
 {group:'Estado y respaldo',label:'Vida útil restante',values:ms.map(m=>m.life)},
 {group:'Estado y respaldo',label:'Garantía',values:ms.map(m=>m.warranty)},
 {group:'Disponibilidad',label:'Disponibilidad',values:ms.map(m=>m.availability)},
 {group:'Disponibilidad',label:'Plazo de entrega',values:ms.map(m=>m.leadTime)}];}
