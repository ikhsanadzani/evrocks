// @ts-nocheck
import axios from 'axios';

export const wpApi = axios.create({
    baseURL: 'http://192.168.122.204/wp-json',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const endpoints = ['archive', 'exhibition'];

const parseItem = (item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title?.rendered ?? 'Untitled',
    content: item.content?.rendered ?? '',
    date: item.date,
    status: item.status,
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
                        params: { per_page: per_pages, _embed: true }
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