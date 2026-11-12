// @ts-nocheck
import axios from 'axios';

export const wpApi = axios.create({
    baseURL: 'http://192.168.122.204/wp-json/wp/v2', 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const endpoints = [ 'archive', 'exhibition' ];

const parseItem = (item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title?.rendered ?? 'Untitled',
    content: item.content?.rendered ?? '',
    date: item.date,
    status: item.status,
    metabox: item.metabox ?? {}
});

export const api_service = Object.fromEntries(
    endpoints.map((endpoint) => [
        endpoint,
        {
            async getAll(per_pages = 50) {
                try {
                    const response = await wpApi.get(`/${endpoint}`, {
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