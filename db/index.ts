import postgres from 'postgres';
let connection: ReturnType<typeof postgres> | undefined;
function client() {
 if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL');
 return connection ??= postgres(process.env.DATABASE_URL, {prepare:false, max:1, idle_timeout:20, connect_timeout:10, ssl:'require'});
}
// Keeps the existing parameterized queries while using PostgreSQL on Supabase.
export function db() {
 return { prepare(query:string) {
  let index=0;
  const sql=query.replace(/\?/g,()=>`$${++index}`);
  let values: (string | number | boolean | null)[]=[];
  const statement={
   bind(...args: typeof values){values=args;return statement;},
   async all<T=Record<string,unknown>>(){const rows=await client().unsafe(sql,values);return {results:Array.from(rows) as T[]};},
   async first<T=Record<string,unknown>>(){return (await statement.all<T>()).results[0]??null;},
   async run(){await client().unsafe(sql,values);return {success:true};}
  };
  return statement;
 }};
}
