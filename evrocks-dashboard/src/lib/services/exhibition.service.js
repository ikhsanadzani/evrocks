// @ts-nocheck
import { wpApi } from "#lib/api.js";

export const exhibition_service = {
    async getAll(perPage = 50) {
        try {
            const response = await wpApi.get('/exhibition', {
                params: { 
                    per_page: perPage, 
                    _embed: true 
                }
            });
            
            const exhibitions = response.data.map(item => ({
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
                exhibition,
                total: Number(response.headers['x-wp-total'] || exhibitions.length)
            };
        } catch (error) {
            console.error('gagal mengambil data dari wordpress', error.message);
            return {
                exhibition_service: [],
                total: 0,
                error: error.message
            };
        }
    }
};