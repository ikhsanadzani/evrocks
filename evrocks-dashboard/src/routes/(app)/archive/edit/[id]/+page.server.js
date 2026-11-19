// @ts-nocheck
import { error, fail, redirect } from "@sveltejs/kit";
import { api_service } from "#lib/api.js";
import { TAXONOMIES } from "#lib/taxonomies.js";

export async function load ({params}) {
        // 1. Ambil data post sesuai angka [id] di URL
    const { item, error: err } = await api_service.archive.get_by_id(params.id);
    if ( !item ) throw error(404, err || 'Archive Not Found');

        // 2. Ambil daftar pilihan term untuk setiap taxonomy milik archive
    const taxonomy_terms = {};
    for (const tax of TAXONOMIES.archive) {
        const res = await api_service.taxonomy.list(tax.key);
        taxonomy_terms[tax.key] = res.items;
    }
    // 3. Kirim ke +page.svelte sebagai data.archive dan data.taxonomy_terms
    return { archive: item, taxonomy_terms };
}

export const actions = {
    update_archive: async ({ request, params }) => {
        const form_data = await request.formData();
        const { error: err } = await api_service.archive.get_by_id(params.id, form_data);
        if (err) return fail(400, { error: err });
        throw redirect(303, '/archive');
    }
};