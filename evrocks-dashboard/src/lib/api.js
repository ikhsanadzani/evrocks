// @ts-nocheck
import axios from 'axios';
import { env } from '$env/dynamic/private';
import { ContextMenu } from 'bits-ui';
import { parse } from 'svelte/compiler';

const auth_token = Buffer.from(
    `${env.WP_USER ?? 'sansan'}:${env.WP_APP_PASSWORD ?? ''}`,
).toString('base64');

export const wpApi = axios.create({
    baseURL: 'http://192.168.122.204/wp-json', // just example
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
    raw_title: item.title?.raw ?? item.title?.rendered ?? '',
    raw_content: item.content?.raw ?? item.content?.rendered ?? '',
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
            },

            async get_by_id(id) {
                try {
                    const response = await wpApi.get(`/wp/v2/${endpoint}/${id}`, {
                        params: { context: 'edit' }
                    });
                    return { item: parseItem(response.data), error: null };
                } catch (error) {
                    console.error(`[api_service.${endpoint}.getById] Error:`, error.message);
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