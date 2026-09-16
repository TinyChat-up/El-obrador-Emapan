import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseConfig } from '@/lib/supabase';
// Identity is verified on the server by Supabase Auth.
export async function getUser(){
 const token=(await cookies()).get('emapan-session')?.value;
 if(!token)return null;
 const {url,key}=supabaseConfig();
 const response=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:'no-store'});
 if(!response.ok)return null;
 const user=await response.json();
 if(!user.id||!user.email)return null;
 return {userId:String(user.id),email:String(user.email),displayName:String(user.email),fullName:null};
}
export async function requireUser(_returnTo:string){const user=await getUser();if(!user)redirect('/acceso');return user;}
export function signInPath(_returnTo:string){return '/acceso';}
export function signOutPath(_returnTo='/'){return '/salir';}
