// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { api_service } from '#lib/api.js';

export async function load() {
    const [loans_res, archives_res] = await Promise.all([
        api_service.lender.getAll(50),
        api_service.archive.getAll(50)
    ]);

    return {
        loans: loans_res.items,
        archives: archives_res.items.filter((a) => a.status === 'publish')
    };
}

export const actions = {
    update_lender: async ({ request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id')?.toString();
        const status = form_data.get('status')?.toString();
        const reason = form_data.get('reason')?.toString() ?? '';
        const archive_ids = form_data.getAll('archive_ids').map(Number).filter((n) => n > 0);

        const { error } = await api_service.lender.update_status(id, { status, reason, archive_ids });
        if (error) return fail(400, { error });
        redirect(303, '/lender');
    }
};
