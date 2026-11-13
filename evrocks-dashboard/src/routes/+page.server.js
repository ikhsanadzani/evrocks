// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';

async function save_post(service, request, redirect_url) {
    const form_data = await request.formData();
    const id = form_data.get('id')?.toString();
    const { error } = await service.update_from_form(id, form_data);

    if (error) return fail(400, { error });
    throw redirect(303, redirect_url);
}

export async function load({ url }) {
    const tab = url.searchParams.get('tab');
    const view = url.searchParams.get('view');
    const edit_id = url.searchParams.get('id');

    const [archive_res, exhibition_res, lender_res, edit_archive, edit_exhibition] = await Promise.all([
        api_service.archive.getAll(50),
        api_service.exhibition.getAll(50),
        api_service.lender.getAll(50),
        tab === 'archive' && view === 'edit' && edit_id ? api_service.archive.get_by_id(edit_id) : { item: null, error: null },
        tab === 'exhibition' && view === 'edit' && edit_id ? api_service.exhibition.get_by_id(edit_id) : { item: null, error: null }
    ]);

    return {
        archives: archive_res.items,
        exhibitions: exhibition_res.items,
        loans: lender_res.items,
        editing_archive: edit_archive.item,
        edit_archive_error: edit_archive.error,
        editing_exhibition: edit_exhibition.item,
        edit_exhibition_error: edit_exhibition.error
    };
}

export const actions = {
    update_archive: ({ request }) => save_post(api_service.archive, request, '/?tab=archive'),
    update_exhibition: ({ request }) => save_post(api_service.exhibition, request, '/?tab=exhibition')
};