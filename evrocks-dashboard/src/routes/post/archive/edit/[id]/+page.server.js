// @ts-nocheck
import { error, fail, redirect } from "@sveltejs/kit";
import { api_service } from "#lib/api.js";

export async function load({params}) {
    const { item, error:apiError } = await api_service.archive.get_by_id(params.id);
    
    if (!item) {
        throw error(404, apiError || 'Archive not found');
    }

    return { archive: item };
}

export const actions = {
    default: async ({ request, params }) => {
        const from_data = await request.formData();
        const title = formData.get('title')?.toString().trim();
        const content = formData.get('content')?.toString() ?? '';
        const status = formData.get('status')?.toString() ?? 'Publish';

        if (!title) {
            return fail(400, { error: 'Title is required' });
        }

        const { error: updateError } = await api_service.archive.update(params.id, {
            title,
            content,
            status
        });

        if (updateError) {
            return fail(500, { error: updateError });
        }

        throw redirect(303, '/?tab=archive');
    }
}