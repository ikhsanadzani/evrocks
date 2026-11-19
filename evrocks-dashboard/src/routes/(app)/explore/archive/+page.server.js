// @ts-nocheck
import { api_service } from "#lib/api.js";
import { error } from "@sveltejs/kit";

export async function load() {

    const q = url.searchParams.get('q')?.trim().toLowerCase()?? ''; 
    const res = await api_service.archive.getAll(50);
    let archives = res.items.filter((item) => item.status === 'publish');


    if (q) {
        archives = archives.filter((item) => 
            (item.title ?? '').toLowerCase().includes(q) || (item.metabox?.code ?? '').toLowerCase().includes(q)
        );
    }
    return {archives, error: res.error};
}