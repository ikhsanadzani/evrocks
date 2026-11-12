// @ts-nocheck
import { wpApi } from "#lib/api.js";

export const archive_service = {
    async getAll(perPage = 50) {
        try {
            const response = await wpApi.get('/archive', {
                params: { 
                    per_page: perPage, 
                    _embed: true 
                }
            });
            
            const archives = response.data.map(item => ({
                id: item.id,
                slug: item.slug,
                title: item.title?.rendered ?? 'Untitled',
                content: item.content?.rendered ?? '',
                date: item.date,
                status: item.status,
                link: item.link,
                metabox: item.metabox ?? {}
            }));

            return {
                archives,
                total: Number(response.headers['x-wp-total'] || archives.length)
            };
        } catch (error) {
            console.error('gagal mengambil data dari wordpress', error.message);
            return {
                archive_service: [],
                total: 0,
                error: error.message
            };
        }
    }
};