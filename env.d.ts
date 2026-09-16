// Variables de entorno del proyecto. Se configuran en Vercel > Settings >
// Environment Variables con estos mismos nombres (ver .env.example).
declare namespace NodeJS {
  interface ProcessEnv {
    /** URI del Transaction pooler de Supabase (puerto 6543). Obligatoria. */
    DATABASE_URL?: string;
    /** URL del proyecto Supabase, sin barra final. Obligatoria. */
    SUPABASE_URL?: string;
    /** Clave de servidor de Supabase (service_role o secret). Obligatoria. */
    SUPABASE_SERVICE_ROLE_KEY?: string;
    /** Correo comercial que recibe las solicitudes. */
    NOTIFICATION_EMAIL?: string;
    /** Número internacional sin + ni espacios, por ejemplo 34600111222. */
    WHATSAPP_NUMBER?: string;
    /** "true" para avisos reales; cualquier otro valor los desactiva. */
    LIVE_INQUIRIES?: string;
    /** Opcional: clave de Resend para los avisos por correo. */
    RESEND_API_KEY?: string;
    /** Opcional: remitente verificado en Resend. */
    FROM_EMAIL?: string;
  }
}
