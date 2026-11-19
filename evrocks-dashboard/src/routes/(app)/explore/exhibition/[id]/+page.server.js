import { error } from "@sveltejs/kit";
import { api_service } from "#lib/api.js";

export async function load({params}) {
    const {item, error: err} = await api_service.exhibition.get_by_id(params.id);

    if (!item || item.status !=='publish') {
        error(404, err || 'exhibition not found');
    }

    return {exhibition: item};
}