export type Photo={url:string;label:string;kind:'exterior'|'interior'|'detail';source?:string};
export type Machine={id:string;brand:string;model:string;comparisonKey?:string;type:string;category:string;condition:'Nueva'|'Reacondicionada';description:string;functioning:string;images:Photo[];year:number|null;price:number|null;capacity:string;power:string;dimensions:string;voltage:string;warranty:string;leadTime:string;inspection:string;workDone:string;defects:string;life:string;availability:string;isDemo:boolean;published:boolean;source:string};
export type Settings={brand:string;email:string;whatsapp:string;legalName:string;taxId:string;address:string;privacyEmail:string;showDemo:boolean;liveInquiries:boolean};
export const defaults:Settings={brand:'El Obrador de Emapan S.L.',email:'',whatsapp:'',legalName:'Emapan S.L.',taxId:'',address:'',privacyEmail:'',showDemo:false,liveInquiries:false};
export const partnerBrands=['LABUS','Carpigiani','Roboqbo','Mondial Forni','FM','IFI','WIESHEU'];
export const categories=['Todas','Panadería','Heladería','Pastelería','Hostelería'];
export const money=(n:number|null)=>n===null?'A presupuestar':new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
export const blankMachine:Machine={id:'',brand:'',model:'',comparisonKey:'',type:'',category:'Panadería',condition:'Reacondicionada',description:'',functioning:'',images:[],year:null,price:null,capacity:'',power:'',dimensions:'',voltage:'',warranty:'Por concretar en la propuesta',leadTime:'Por confirmar',inspection:'Pendiente de informe técnico',workDone:'',defects:'Pendiente de revisión',life:'No evaluada. Depende del uso, el mantenimiento y el estado técnico.',availability:'Por confirmar',isDemo:false,published:false,source:''};
const reference=(id:string,brand:string,model:string,type:string,category:string,img:string,description:string,source:string):Machine=>({...blankMachine,id,brand,model,type,category,condition:'Nueva',description,functioning:description,images:[{url:'/images/'+img,label:'Vista de referencia del fabricante',kind:'exterior',source}],source,isDemo:true,published:true,availability:'Modelo de referencia',inspection:'Unidad y configuración por confirmar',defects:'No se ha asignado una unidad física'});
const domino=reference('demo-domino','Mondial Forni','Domino','Horno eléctrico modular','Panadería','mondial-domino.png','Cocción por pisos con cámaras independientes. Una solución modular que se adapta al ritmo de tu obrador.','https://www.mondialforni.com/en/commercial-electric-oven-domino.htm');
const lab=reference('demo-labotronic','Carpigiani','Labotronic HE-I','Mantecadora profesional','Heladería','carpigiani-labotronic-full.jpg','Transforma la mezcla en helado mediante enfriamiento y agitación controlados. Modelo de referencia 20/90 HE-I; configuración por confirmar.','https://www.briewig.de/speiseeis/produkt/carpigiani_labotronic_he_h/229');
export const demos:Machine[]=[domino,lab,reference('demo-pastomaster','Carpigiani','Pastomaster 60 HE','Pasteurizador profesional','Heladería','carpigiani-pastomaster.jpg','Tratamiento térmico de mezclas para helado. Configuración y ficha técnica a confirmar en la propuesta.','https://www.briewig.de/speiseeis/produkt/carpigiani_pastomaster_he/59'),reference('demo-techno','Mondial Forni','Techno','Horno de carro rotativo','Panadería','mondial-techno.png','Cocción con carro rotativo para panadería y pastelería. La gama ofrece variantes eléctricas y de combustión.','https://www.mondialforni.com/en/commercial-electric-oven-techno.htm'),reference('demo-slim','Mondial Forni','Slim','Horno rotativo compacto','Pastelería','mondial-slim.png','Un horno rotativo de formato compacto para obradores con espacio limitado. Bandejas de 40 × 60 cm según configuración.','https://www.mondialforni.com/en/commercial-electric-oven-slim.htm')];
const qbo15=reference('demo-roboqbo-qbo15','Roboqbo','Qbo 15','Sistema de procesado multifunción','Pastelería','roboqbo-qbo15.jpg','Equipo de procesado para cocinar, mezclar y transformar elaboraciones. Configuración y accesorios a concretar para cada proyecto.','https://www.roboqbo.it/en/prodotto/qbo-15/');
qbo15.capacity='Cuba de 15 litros · ficha del fabricante';
qbo15.voltage='Trifásica 400 / 220 / 200 V · 50/60 Hz · según versión';
qbo15.dimensions='1240 × 997 × 1381 mm (ancho × fondo × alto)';
qbo15.functioning='Procesado en cuba de acero AISI 316L, temperatura máxima de 120 °C, vacío máximo de −980 mbar y velocidad variable de 30 a 3000 rpm. Configuración y accesorios a confirmar.';
qbo15.images.push({url:'/images/roboqbo-interior.jpg',label:'Interior de la cuba en funcionamiento · imagen de referencia de la gama Qbo',kind:'interior',source:'https://www.roboqbo.it/en/prodotto/qbo-15/'});
demos.push(
 reference('demo-labus-abv','LABUS','ABV','Amasadora de brazos verticales','Panadería','labus-abv.jpg','Amasadora de brazos verticales para la preparación de masas. Modelo de referencia de la gama ABV de LABUS; capacidad y versión a confirmar.','https://labus.es/producto/amasadora-mixer/'),
 qbo15,
 {...reference('demo-fm-stb606','FM','STB 606 V7','Horno mixto de panadería','Panadería','fm-stb606.png','Horno eléctrico mixto para panadería con control táctil. La configuración de accesorios, instalación y servicio se concreta en la propuesta.','https://fmindustrial.es/producto/stb-606-v7/'),capacity:'6 bandejas 600 × 400 mm / GN 1/1 · ficha del fabricante',power:'10,65 kW · ficha del fabricante',voltage:'400 V · trifásica · 50/60 Hz',dimensions:'880 × 955 × 835 mm (ancho × fondo × alto) · ficha del fabricante'},
 reference('demo-wiesheu-dibas','WIESHEU','Dibas blue²','Horno de convección para punto de venta','Panadería','wiesheu-dibas.png','Horno de convección con puerta que se recoge lateralmente. La imagen ilustra una combinación de hornos y carro; los elementos incluidos se definirán en la propuesta.','https://www.wiesheu.de/produkte/ladenbackoefen/dibas-blue')
);
const esedra=reference('demo-ifi-esedra','IFI','Esedra','Vitrina refrigerada de exposición','Heladería','ifi-esedra.jpg','Vitrina de exposición para heladería y pastelería. Las versiones, acabados y medidas se seleccionan según el producto y el espacio del establecimiento.','https://www.ifi.it/en/products/esedra/');
esedra.images[0].source='https://www.archiexpo.com/prod/ifi/product-4781-2449733.html';
demos.push(esedra);
export function normalizeComparisonKey(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
export function machineComparisonKey(machine:Machine){return normalizeComparisonKey(machine.comparisonKey?.trim()||`${machine.brand} ${machine.model}`);}
export function comparisonRows(ms:Machine[]){return [
 {group:'Inversión',label:'Precio de la máquina',values:ms.map(m=>money(m.price))},
 {group:'Inversión',label:'Envío e instalación',values:ms.map(()=> 'Se calculan para tu ubicación')},
 {group:'La máquina',label:'Estado',values:ms.map(m=>m.condition)},
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
