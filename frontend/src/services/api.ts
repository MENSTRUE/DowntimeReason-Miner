import type { ClassificationResult, Experiment, Health, ReportName, ReportResponse, ThemeResult, ApiError } from '../types/api';
export const API_BASE=(import.meta.env.VITE_API_BASE_URL as string | undefined || 'http://127.0.0.1:8000/api/v1').replace(/\/$/,'');
async function request<T>(path:string, options?:RequestInit):Promise<T>{
  let response:Response;
  try { response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json',...options?.headers},signal:AbortSignal.timeout(20000)}); }
  catch(e){ const err=new Error(e instanceof Error && e.name==='TimeoutError'?'Request timed out. Try again.':'Cannot connect to FastAPI. Start the backend at 127.0.0.1:8000 and check CORS.') as ApiError; throw err; }
  if(!response.ok){ let detail='';try{const body=await response.json() as {detail?:string|unknown;error?:string};detail=typeof body.detail==='string'?body.detail:(body.error||'');}catch{/* non JSON */}
    const err=new Error(detail || `API request failed (${response.status})`) as ApiError;err.status=response.status;throw err;}
  return await response.json() as T;
}
const post=(path:string,body:unknown)=>({method:'POST',body:JSON.stringify(body)});
export const api={
  health:()=>request<Health>('/health'),
  classify:(text:string,experiment:Experiment='02')=>request<{result:ClassificationResult;task:string}>('/classify',post('/classify',{text,experiment})),
  classifyBatch:(texts:string[],experiment:Experiment='02')=>request<{results:ClassificationResult[];task:string}>('/classify/batch',post('/classify/batch',{texts,experiment})),
  theme:(text:string)=>request<{result:ThemeResult}>('/themes',post('/themes',{text})),
  themeBatch:(texts:string[])=>request<{results:ThemeResult[]}>('/themes/batch',post('/themes/batch',{texts})),
  report:(name:ReportName,limit=100)=>request<ReportResponse>(`/analytics/${name}?limit=${limit}`),
};
