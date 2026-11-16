import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { analyze, type Rule, type Submission } from './engine';
import type { Json } from '@/integrations/supabase/types';
const json = (value: unknown) => value as Json;
type Workspace = { rules: Rule[]; submissions: Submission[]; loading: boolean; error: string; reload: () => Promise<void>; saveRule: (r: Rule) => Promise<void>; deleteRule: (id: string) => Promise<void>; submit: (title: string, type: string, content: string) => Promise<string>; update: (id: string, values: Partial<Submission>) => Promise<void> };
const Context = createContext<Workspace | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
 const [rules,setRules] = useState<Rule[]>([]); const [submissions,setSubmissions] = useState<Submission[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
 async function reload() {
  try { const [r,s] = await Promise.all([supabase.from('brand_rules').select('*').order('created_at'),supabase.from('content_submissions').select('*').order('created_at',{ascending:false})]); if(r.error) throw r.error; if(s.error) throw s.error; const rr = r.data as Rule[]; setRules(rr); setSubmissions(s.data.map(row => ({...row, issues: row.issues as unknown as Submission['issues'], rules_snapshot: row.rules_snapshot as unknown as Rule[]}))); setError(''); } catch(e) {setError(e instanceof Error ? e.message : 'Could not load the workspace.');} finally {setLoading(false);}
 }
 useEffect(()=>{void reload();},[]);
 async function saveRule(rule: Rule) {const {error}=await supabase.from('brand_rules').upsert(rule); if(error) throw error; await reload(); toast.success('Guideline saved');}
 async function deleteRule(id:string) {const {error}=await supabase.from('brand_rules').delete().eq('id',id); if(error) throw error; await reload();toast.success('Guideline deleted');}
 async function submit(title:string,type:string,content:string) { const issues=analyze(content,rules); const {data,error}=await supabase.from('content_submissions').insert({title,content_type:type,content,issues:json(issues),rules_snapshot:json(rules)}).select('id').single(); if(error) throw error; await reload(); toast.success('Content checked and submitted'); return data.id; }
 async function update(id:string,values:Partial<Submission>) { const {error}=await supabase.from('content_submissions').update({...values,issues: values.issues ? json(values.issues): undefined,rules_snapshot:values.rules_snapshot ? json(values.rules_snapshot):undefined}).eq('id',id); if(error) throw error; await reload(); }
 return <Context.Provider value={{rules,submissions,loading,error,reload,saveRule,deleteRule,submit,update}}>{children}</Context.Provider>;
}
export function useWorkspace() {const value=useContext(Context);if(!value)throw new Error('Workspace provider required');return value;}
export function notifyError(e:unknown) {toast.error(e instanceof Error ? e.message : String(e));}
