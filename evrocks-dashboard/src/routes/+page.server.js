import { fail } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';
import { archive_service } from '#lib/services/archive.service.js';
  
export async function load({url}) {
        const tab = url.searchParams.get('tab');
        const view = url.searchParams.get('view');
        const edit_id = url.searchParams.get('id');

        const [archiveRes, exhibitionRes, lenderRes, editingRes] = await Promise.all([
            archive_service.getAll(50),
            api_service.exhibition.getAll(50),
            api_service.lender.getAll(50),
            tab === 'archive' && view === 'edit' && edit_id
                ? api_service.archive.get_by_id('edit_id')
                : Promise.resolve({item: null, error: null})
        ]);
  
        return {
            archives: archiveRes.archives ?? [],
            exhibitions: exhibitionRes.items ?? [],
            loans: lenderRes.items ?? [],
            editing_archive: editingRes.item ?? null,
            edit_error: editingRes.error ?? null

        };
    }

    