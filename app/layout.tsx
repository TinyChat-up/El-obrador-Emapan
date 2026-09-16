import type { Metadata } from "next";
import "./globals.css";
import "./vintage.css";
import "./motion.css";
import Motion from "./motion";
export const metadata: Metadata = {title: "El Obrador de Emapan S.L. · Maquinaria con mucho por hacer",description:"Maquinaria de segunda mano de cualquier marca para panadería, pastelería, heladería y hostelería. Compara con modelos nuevos y solicita tu propuesta con envío y garantía.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><Motion/>{children}</body></html>}
