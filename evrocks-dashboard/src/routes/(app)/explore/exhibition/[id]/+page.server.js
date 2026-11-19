// @ts-nocheck                                                                                               
import { error } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';

export async function load({ params }) {
        const { item, error: err } = await api_service.exhibition.get_by_id(params.id);
  
        if (!item || item.status !== 'publish') {
            error(404, err || 'exhibition tidak ditemukan.');
        }
  
		// Ambil daftar arsip yang dipilih untuk exhibitionini (dari metabox _daftar_arsip_pameran)
        const raw_ids = item.metabox?._daftar_arsip_exhibition?? item.meta?._daftar_arsip_exhibition?? [];           
        const linked_ids = Array.isArray(raw_ids) ? raw_ids.map(Number) : [];
  
        let related_archives = [];
        if (linked_ids.length > 0) {
            const archive_res = await api_service.archive.getAll(50);
            related_archives = archive_res.items.filter(
                (a) => a.status === 'publish' && linked_ids.includes(Number(a.id))
            ); 
        }
  
        return { exhibition: item, related_archives };
    }