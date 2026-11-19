 // @ts-nocheck
    import { api_service } from '#lib/api.js';
  
    export async function load() {
        const res = await api_service.exhibition.getAll(50);
        const exhibitions = res.items.filter((item) => item.status === 'publish');
  
        return { exhibitions, error: res.error };
    } 