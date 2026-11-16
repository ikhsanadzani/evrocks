import { error } from "@sveltejs/kit";
import { api_service } from "#lib/api.js";

export async function load({ params }) {
        const { item, error: err } = await
        api_service.archive.get_by_id(params.id);
        if (!item) throw error(404, err || 'Archive tidak ditemukan');        
        return { archive: item };
    }