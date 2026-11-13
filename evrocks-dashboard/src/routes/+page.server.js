// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';
import { archive_service } from '#lib/services/archive.service.js';

async function build_update_payload(form_data) {
    const payload = {
        title: form_data.get('title')?.toString().trim(),
        content: form_data.get('content')?.toString() ?? '',
        status: form_data.get('status')?.toString() ?? 'publish'
    };

    const image_file = form_data.get('featured_image');
    if (image_file instanceof File && image_file.size > 0) {
        const uploaded_img = await api_service.media.upload(image_file);
        if (uploaded_img.error) return { payload: null, error: `Upload gambar gagal: ${uploaded_img.error}` };
        payload.featured_media = uploaded_img.id;
    }

    const attachment_file = form_data.get('attachment_file');
    if (attachment_file instanceof File && attachment_file.size > 0) {
        const uploaded_doc = await api_service.media.upload(attachment_file);
        if (uploaded_doc.error) return { payload: null, error: `Upload file gagal: ${uploaded_doc.error}` };
        payload.meta = { file_digital: uploaded_doc.url };
    }

    return { payload, error: null };
}

export async function load({ url }) {
    const tab = url.searchParams.get('tab');
    const view = url.searchParams.get('view');
    const edit_id = url.searchParams.get('id');

    const [archiveRes, exhibitionRes, lenderRes, editingArchiveRes, editingExhibitionRes] = await Promise.all([
        archive_service.getAll(50),
        api_service.exhibition.getAll(50),
        api_service.lender.getAll(50),
        tab === 'archive' && view === 'edit' && edit_id
            ? archive_service.get_by_id(edit_id)
            : Promise.resolve({ item: null, error: null }),
        tab === 'exhibition' && view === 'edit' && edit_id
            ? api_service.exhibition.get_by_id(edit_id)
            : Promise.resolve({ item: null, error: null })
    ]);

    return {
        archives: archiveRes.archives ?? [],
        exhibitions: exhibitionRes.items ?? [],
        loans: lenderRes.items ?? [],
        editing_archive: editingArchiveRes.item ?? null,
        edit_archive_error: editingArchiveRes.error ?? null,
        editing_exhibition: editingExhibitionRes.item ?? null,
        edit_exhibition_error: editingExhibitionRes.error ?? null
    };
}

export const actions = {
    update_archive: async ({ request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id')?.toString();
        const title = form_data.get('title')?.toString().trim();
        const content = form_data.get('content')?.toString() ?? '';
        const status = form_data.get('status')?.toString() ?? 'publish';

        if (!id || !title) {
            return fail(400, { error: 'ID dan judul arsip wajib diisi.' });
        }

        const { error: update_error } = await archive_service.update(id, {
            title,
            content,
            status
        });

        if (update_error) {
            return fail(500, { error: update_error });
        }

        throw redirect(303, '/?tab=archive');
    },

    update_exhibition: async ({ request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id')?.toString();
        const title = form_data.get('title')?.toString().trim();
        const content = form_data.get('content')?.toString() ?? '';
        const status = form_data.get('status')?.toString() ?? 'publish';

        if (!id || !title) {
            return fail(400, { error: 'ID dan judul pameran wajib diisi.' });
        }

        const { error: update_error } = await api_service.exhibition.update(id, {
            title,
            content,
            status
        });

        if (update_error) {
            return fail(500, { error: update_error });
        }

        throw redirect(303, '/?tab=exhibition');
    }
};