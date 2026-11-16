// @ts-nocheck

import { fail, redirect } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';
import { TAXONOMIES, get_taxonomy } from '#lib/taxonomies.js';

export async function load({ url }) {
    const taxonomy_list = TAXONOMIES[TAB];
        const active_taxonomy = get_taxonomy(TAB, url.searchParams.get('tax')) ?? taxonomy_list[0] ?? null;
        const res = active_taxonomy ? await api_service.taxonomy.list(active_taxonomy.key) : { items: [], error: null };

        return {
        taxonomy_list,
            active_taxonomy,
            terms: res.items,                                                 
            terms_error: res.error
    };
}

