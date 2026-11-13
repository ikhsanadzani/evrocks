// @ts-nocheck
import axios from 'axios';

try { process.loadEnvFile(); } catch {}

const basic_auth = Buffer.from(`${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`).toString('base64');

export const wpApi = axios.create({
    baseURL: process.env.WP_API_URL || 'http://192.168.122.204/wp-json',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basic_auth}`
    }
});

export const parse_wp_post = (item) => ({
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

async function upload_media(file) {
    if (!(file instanceof File) || file.size === 0) return { data: null, error: null };

    try {
        const body = new FormData();
        body.append('file', file, file.name);

        const res = await wpApi.post('/wp/v2/media', body, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { data: { id: res.data.id, url: res.data.source_url }, error: null };
    } catch (err) {
        return { data: null, error: err.response?.data?.message || err.message };
    }
}

const create_cpt_service = (endpoint) => ({
    async getAll(per_page = 50) {
        try {
            const res = await wpApi.get(`/wp/v2/${endpoint}`, {
                params: { per_page, status: 'any', _embed: true }
            });
            const items = res.data.map(parse_wp_post);
            return { items, total: Number(res.headers['x-wp-total'] || items.length), error: null };
        } catch (err) {
            console.error(`[api_service.${endpoint}.getAll] Error:`, err.response?.data || err.message);
            return { items: [], total: 0, error: err.response?.data?.message || err.message };
        }
    },
    async get_by_id(id) {
        try {
            const res = await wpApi.get(`/wp/v2/${endpoint}/${id}`, {
                params: { context: 'edit', _embed: true }
            });
            return { item: parse_wp_post(res.data), error: null };
        } catch (err) {
            return { item: null, error: err.response?.data?.message || err.message };
        }
    },

    async update_from_form(id, form_data) {
        const title = form_data.get('title')?.toString().trim();
        if (!id || !title) return { error: 'ID dan judul wajib diisi.' };

        const [img_res, doc_res] = await Promise.all([
            upload_media(form_data.get('featured_image')),
            upload_media(form_data.get('attachment_file'))
        ]);

        if (img_res.error) return { error: `Upload gambar gagal: ${img_res.error}` };
        if (doc_res.error) return { error: `Upload file gagal: ${doc_res.error}` };

        const payload = {
            title,
            content: form_data.get('content')?.toString() ?? '',
            status: form_data.get('status')?.toString() ?? 'publish',
            ...(img_res.data && { featured_media: img_res.data.id }),
            ...(doc_res.data && { meta: { file_digital: doc_res.data.url } })
        };

        try {
            await wpApi.post(`/wp/v2/${endpoint}/${id}`, payload);
            return { error: null };
        } catch (err) {
            return { error: err.response?.data?.message || err.message };
        }
    }
});

export const api_service = {
    archive: create_cpt_service('archive'),
    exhibition: create_cpt_service('exhibition'),
    lender: {
        async getAll(per_page = 50) {
            try {
                const res = await wpApi.get('/evrocks/v1/lender', { params: { per_page } });
                return { items: res.data, total: Number(res.headers['x-wp-total'] || res.data.length) };
            } catch (err) {
                return { items: [], total: 0, error: err.message };
            }
        }
    }
};