// @ts-nocheck
import { wpApi } from "#lib/api.js";

const parse_archive = (item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title?.rendered ?? 'Untitled',
    raw_title: item.title?.raw ?? item.title?.rendered ?? '',
    raw_content: item.content?.raw ?? item.content?.rendered ?? '',
    content: item.content?.rendered ?? '',
    date: item.date,
    status: item.status,
    link: item.link,
    metabox: item.metabox ?? {}
});

export const archive_service = {
    async getAll(perPage = 50) {
        try {
            const response = await wpApi.get('/wp/v2/archive', {
                params: { per_page: perPage, _embed: true }
            });

            const archives = response.data.map(parse_archive);

            return {
                archives,
                total: Number(response.headers['x-wp-total'] || archives.length)
            };
        } catch (error) {
            console.error('[archive_service.getAll] Error:', error.response?.data || error.message);
            return { archives: [], total: 0, error: error.message };
        }
    },

    async get_by_id(id) {
        try {
            const response = await wpApi.get(`/wp/v2/archive/${id}`, {
                params: { context: 'edit' }
            });
            return { item: parse_archive(response.data), error: null };
        } catch (error) {
            console.error('[archive_service.get_by_id] Error:', error.response?.data || error.message);
            return { item: null, error: error.response?.data?.message || error.message };
        }
    },

    async update(id, payload) {
        try {
            const response = await wpApi.post(`/wp/v2/archive/${id}`, payload);
            return { item: parse_archive(response.data), error: null };
        } catch (error) {
            console.error('[archive_service.update] Error:', error.response?.data || error.message);
            return { item: null, error: error.response?.data?.message || error.message };
        }
    }
};