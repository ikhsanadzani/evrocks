// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';
import { TAXONOMIES, get_taxonomy } from '#lib/taxonomies.js';

async function save_post(service, request, redirect_url) {
    const form_data = await request.formData();
    const id = form_data.get('id')?.toString();
    const { error } = await service.update_from_form(id, form_data);

    if (error) return fail(400, { error });
    throw redirect(303, redirect_url);
}

// Ambil tab + taxonomy dari form, tolak kalau tidak ada di whitelist TAXONOMIES
async function read_taxonomy_form(request) {
    const form_data = await request.formData();
    const tab = form_data.get('tab')?.toString();
    const tax = form_data.get('tax')?.toString();
    return { form_data, tab, tax, taxonomy: get_taxonomy(tab, tax) };
}

export async function load({ url }) {
    const tab = url.searchParams.get('tab');
    const view = url.searchParams.get('view');
    const edit_id = url.searchParams.get('id');

    // Taxonomy: hanya di-fetch saat view=taxonomy; default ke taxonomy pertama di tab tsb
    const taxonomy_list = TAXONOMIES[tab] ?? [];
    const active_taxonomy =
        view === 'taxonomy'
            ? get_taxonomy(tab, url.searchParams.get('tax')) ?? taxonomy_list[0] ?? null
            : null;

    const [archive_res, exhibition_res, lender_res, edit_archive, edit_exhibition, terms_res] = await Promise.all([
        api_service.archive.getAll(50),
        api_service.exhibition.getAll(50),
        api_service.lender.getAll(50),
        tab === 'archive' && (view === 'edit' || view === 'detail') && edit_id ? api_service.archive.get_by_id(edit_id) : { item: null, error: null },
        tab === 'exhibition' && (view === 'edit' || view === 'detail') && edit_id ? api_service.exhibition.get_by_id(edit_id) : { item: null, error: null },
        active_taxonomy ? api_service.taxonomy.list(active_taxonomy.key) : { items: [], error: null }
    ]);

    return {
        archives: archive_res.items,
        exhibitions: exhibition_res.items,
        loans: lender_res.items,
        editing_archive: edit_archive.item,
        edit_archive_error: edit_archive.error,
        editing_exhibition: edit_exhibition.item,
        edit_exhibition_error: edit_exhibition.error,
        taxonomy_list,
        active_taxonomy,
        terms: terms_res.items,
        terms_error: terms_res.error
    };
}

export const actions = {
    update_archive: ({ request }) => save_post(api_service.archive, request, '/?tab=archive'),
    update_exhibition: ({ request }) => save_post(api_service.exhibition, request, '/?tab=exhibition'),
    update_lender: async ({ request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id')?.toString();
        const status = form_data.get('status')?.toString();
        const reason = form_data.get('reason')?.toString() ?? '';

        const { error } = await api_service.lender.update_status(id, { status, reason });
        if (error) return fail(400, { error });
        throw redirect(303, '/?tab=lender');
    },
    create_term: async ({ request }) => {
        const { form_data, tab, tax, taxonomy } = await read_taxonomy_form(request);
        if (!taxonomy) return fail(400, { taxonomy_error: 'Taxonomy tidak dikenal.' });

        const { error } = await api_service.taxonomy.create(tax, {
            name: form_data.get('name')?.toString().trim(),
            slug: form_data.get('slug')?.toString().trim(),
            description: form_data.get('description')?.toString().trim(),
            parent: taxonomy.hierarchical ? Number(form_data.get('parent')) || 0 : 0
        });
        if (error) return fail(400, { taxonomy_error: error });
        throw redirect(303, `/?tab=${tab}&view=taxonomy&tax=${tax}`);
    },
    delete_term: async ({ request }) => {
        const { form_data, tab, tax, taxonomy } = await read_taxonomy_form(request);
        if (!taxonomy) return fail(400, { taxonomy_error: 'Taxonomy tidak dikenal.' });

        const { error } = await api_service.taxonomy.remove(tax, form_data.get('id')?.toString());
        if (error) return fail(400, { taxonomy_error: error });
        throw redirect(303, `/?tab=${tab}&view=taxonomy&tax=${tax}`);
    }
};