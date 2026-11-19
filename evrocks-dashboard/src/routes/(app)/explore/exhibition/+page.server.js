 // @ts-nocheck
    import { api_service } from '#lib/api.js';
  
    export async function load({url}) {
        const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';
        const res = await api_service.exhibition.getAll(50);
        let exhibitions = res.items.filter((item) => item.status === 'publish');
        
        if (q) {
            exhibitions = exhibitions.filter((item) =>
                (item.title ?? '').toLowerCase().includes(q)
            );
        }
        return { exhibitions, error: res.error };
    } 