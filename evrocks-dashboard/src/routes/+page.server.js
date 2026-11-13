// @ts-nocheck

import { error, fail } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';
import { archive_service } from '#lib/services/archive.service.js';
import { form } from '$app/server';
import { success } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
  
export async function load({url}) {
        const tab = url.searchParams.get('tab');
        const view = url.searchParams.get('view');
        const edit_id = url.searchParams.get('id');

        const [archiveRes, exhibitionRes, lenderRes, editingRes] = await Promise.all([
            archive_service.getAll(50),
            api_service.exhibition.getAll(50),
            api_service.lender.getAll(50),
            tab === 'archive' && view === 'edit' && edit_id
                ? api_service.archive.get_by_id('edit_id')
                : Promise.resolve({item: null, error: null})
        ]);
  
        return {
            archives: archiveRes.archives ?? [],
            exhibitions: exhibitionRes.items ?? [],
            loans: lenderRes.items ?? [],
            editing_archive: editingRes.item ?? null,
            edit_error: editingRes.error ?? null

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

            const { error: update_error } = await api_service.archive.update(id, {
                title,
                content,
                status
            });

            if (update_error) {
                return fail(500, { error: update_error });
            }

            throw redirect(303, '/?tab=archive');
        }
    };

