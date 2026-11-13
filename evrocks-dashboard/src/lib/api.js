// @ts-nocheck
import axios from 'axios';
import { url } from 'zod';

try {
    process.loadEnvFile();
} catch {
    // Abaikan jika file .env tidak ditemukan (misalnya saat pakai env dari sistem/OS)
}

const basic_auth = Buffer.from(
    `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString('base64');

export const wpApi = axios.create({
    baseURL: process.env.WP_API_URL || 'http://192.168.122.204/wp-json',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basic_auth}`
    }
});

const endpoints = ['archive', 'exhibition'];

const parseItem = (item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title?.rendered ?? 'Untitled',
    raw_title: item.title?.raw ?? item.title?.rendered ?? '',
    raw_content: item.content?.raw ?? item.content?.rendered ?? '',
    content: item.content?.rendered ?? '',
    date: item.date,
    status: item.status,
    featured_media: item.featured_media ?? 0,
    featured_image_url: item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
    file_digital: item.meta?.file_digital ?? item.metabox?.file_digital ?? '',
    metabox: item.metabox ?? {}
});

const parseLoanItem = (item) => ({
    id: Number(item.id),
    user_id: Number(item.user_id),
    purpose: item.purpose ?? '-',
    duration: item.duration ?? '',
    title: item.title ?? '',
    loan: typeof item.loan === 'string' ? JSON.parse(item.loan || '[]') : (item.loan ?? []),
    reason: item.reason ?? '-',
    status: item.status ?? 'pending',
    request_time: item.request_time ?? ''
});

const cpt_services = Object.fromEntries(
    endpoints.map((endpoint) => [
        endpoint,
        {
            async getAll(per_pages = 50) {
                try {
                    const response = await wpApi.get(`/wp/v2/${endpoint}`, {
                        params: { per_page: per_pages, status: 'any', _embed: true }
                    });
                    const items = response.data.map(parseItem);

                    return {
                        items,
                        total: Number(response.headers['x-wp-total'] || items.length)
                    };
                } catch (error) {
                    console.error(`[api_service.${endpoint}] Error:`, error.message);
                    return { items: [], total: 0, error: error.message };
                }
            },

            async get_by_id(id) {
                try {
                    const response = await wpApi.get(`/wp/v2/${endpoint}/${id}`, {
                        params: { context: 'edit', _embed: true }
                    });
                    return { item: parseItem(response.data), error: null };
                } catch (error) {
                    console.error(`[api_service.${endpoint}.get_by_id] Error:`, error.message);
                    return { item: null, error: error.response?.data?.message || error.message };
                }
            },

            async update(id, payload) {
                try {
                    const response = await wpApi.post(`/wp/v2/${endpoint}/${id}`, payload);
                    return { item: parseItem(response.data), error: null };
                } catch (error) {
                    console.error(`[api_service.${endpoint}.update] Error:`, error.message);
                    return { item: null, error: error.response?.data?.message || error.message };
                }
            }
        }
    ])
);

const lender_service = {
    async getAll(per_pages = 50) {
        try {
            const response = await wpApi.get('/evrocks/v1/lender', {
                params: { per_page: per_pages }
            });

            const items = response.data.map(parseLoanItem);

            return {
                items,
                total: Number(response.headers['x-wp-total'] || items.length)
            };
        } catch (error) {
            console.error('[api_service.lender] Error:', error.message);
            return { items: [], total: 0, error: error.message };
        }
    }
};

export const api_service = {
    ...cpt_services,
    lender: lender_service
};

const media_service = {
    async upload (file) {
        try {
            const payload = new FormData();
            payload.append('file', file, file.name);

            const response = await wpApi.post('/wp/v2/media', payload, {
                headers: { 'Content-type': 'multipart/form-data' }
            });

            return{
                id: response.data.id,
                url: response.data.source_url,
                error: null
            }
        } catch (error) {
            console.error('[api_service.media.upload] Error', error.response?.data || error.message);

            return{
                id: null,
                url: null,
                error: error.response?.data?.message || error.message
            }
            
        }
    }
}