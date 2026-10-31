import { useCallback, useEffect, useState } from 'react';
export function useAsync<T>(loader:()=>Promise<T>,deps:unknown[]=[]){
 const [data,setData]=useState<T|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState<string|null>(null);
 const reload=useCallback(async()=>{setLoading(true);setError(null);try{setData(await loader());}catch(e){setError(e instanceof Error?e.message:String(e));}finally{setLoading(false);}},deps);
 useEffect(()=>{void reload();},[reload]);return {data,loading,error,reload};
}
