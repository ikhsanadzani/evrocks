// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';
import { TAXONOMIES, get_taxonomy } from '#lib/taxonomies.js';

const TAB = 'archive';

export async function load({ url }) {
    const taxonomy_list = TAXONOMIES[TAB];
    const active_taxonomy = get_taxonomy(TAB, url.searchParams.get('tax')) ?? taxonomy_list[0] ?? null;
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const res = active_taxonomy
        ? await api_service.taxonomy.list(active_taxonomy.key, { page })
        : { items: [], total: 0, total_pages: 1, page: 1, error: null };

    return {
        taxonomy_list,
        active_taxonomy,
        terms: res.items,
        total: res.total,
        total_pages: res.total_pages,
        page: res.page,
        terms_error: res.error
    };
}

export const actions = {
    create_term: async ({ request }) => {
        const form_data = await request.formData();
        const tax = form_data.get('tax')?.toString();
        const taxonomy = get_taxonomy(TAB, tax);
        if (!taxonomy) return fail(400, { taxonomy_error: 'Taxonomy not found.' });

        const { error } = await api_service.taxonomy.create(tax, {
            name: form_data.get('name')?.toString().trim(),
            slug: form_data.get('slug')?.toString().trim(),
            description: form_data.get('description')?.toString().trim(),
            parent: taxonomy.hierarchical ? Number(form_data.get('parent')) || 0 : 0
        });
        if (error) return fail(400, { taxonomy_error: error });
        redirect(303, `/${TAB}/taxonomy?tax=${tax}`);
    },
    update_term: async ({ request }) => {
        const form_data = await request.formData();
        const tax = form_data.get('tax')?.toString();
        const taxonomy = get_taxonomy(TAB, tax);
        if (!taxonomy) return fail(400, { taxonomy_error: 'Taxonomy not found.' });

        const { error } = await api_service.taxonomy.update(tax, form_data.get('id')?.toString(), {
            name: form_data.get('name')?.toString().trim(),
            slug: form_data.get('slug')?.toString().trim(),
            description: form_data.get('description')?.toString().trim(),
            parent: taxonomy.hierarchical ? Number(form_data.get('parent')) || 0 : 0
        });
        if (error) return fail(400, { taxonomy_error: error });
        redirect(303, `/${TAB}/taxonomy?tax=${tax}`);
    },
    delete_term: async ({ request }) => {
        const form_data = await request.formData();
        const tax = form_data.get('tax')?.toString();
        if (!get_taxonomy(TAB, tax)) return fail(400, { taxonomy_error: 'Taxonomy not found.' });

        const { error } = await api_service.taxonomy.remove(tax, form_data.get('id')?.toString());
        if (error) return fail(400, { taxonomy_error: error });
        redirect(303, `/${TAB}/taxonomy?tax=${tax}`);
    }
};
