// @ts-nocheck
import axios from 'axios';
import { TAXONOMIES } from '#lib/taxonomies.js';

// Baca file .env supaya process.env.WP_API_URL, WP_USER, WP_APP_PASSWORD terbaca
try { process.loadEnvFile(); } catch {}

// Buat koneksi axios ke WordPress dengan Basic Auth (Application Password)
export const wpApi = axios.create({
    baseURL: process.env.WP_API_URL || 'http://192.168.122.204/wp-json',
    timeout: 15000,
    auth: { username: process.env.WP_USER, password: process.env.WP_APP_PASSWORD }
});


// Pembungkus try/catch agar kita tidak perlu menulis try/catch berulang-ulang di tiap fungsi.
// - Kalau fn() sukses: kembalikan { error: null, ...hasilnya }
// - Kalau fn() gagal: tangkap pesan error dari WordPress, kembalikan { ...fallback, error: pesan }
async function run(fn, fallback = {}) {
    try {
        return { error: null, ...(await fn()) };
    } catch (err) {
        return { ...fallback, error: err.response?.data?.message || err.message };
    }
}

// Membaca data taxonomy yang menempel pada post (dari parameter ?_embed=true).
// WordPress mengirim _embedded['wp:term'] dalam bentuk array 2 lapis: [ [term1, term2], [term3] ]
const parse_wp_terms = (item) => {
    const groups = item._embedded?.['wp:term'] ?? [];
    const by_tax = {};
    for (const group of groups) {
        for (const term of group ?? []) {
            if (!term?.taxonomy) continue;
            // Kelompokkan berdasarkan nama taxonomy-nya, misal by_tax['archive-creator'] = [...]
            (by_tax[term.taxonomy] ??= []).push({
                id: term.id,
                name: term.name,
                slug: term.slug
            });
        }
    }
    return by_tax;
};

// Merapikan JSON mentah post WordPress menjadi object yang bersih untuk UI Svelte
export const parse_wp_post = (item, attachments = []) => ({
    id: item.id,
    slug: item.slug,
    link: item.link ?? '',
    title: item.title?.rendered ?? 'Untitled',
    raw_title: item.title?.raw ?? item.title?.rendered ?? '',
    raw_content: item.content?.raw ?? item.content?.rendered ?? '',
    content: item.content?.rendered ?? '',
    date: item.date,
    status: item.status,
    featured_media: item.featured_media ?? 0,
    featured_image_url: item._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
    file_digital: item.meta?.file_digital ?? item.metabox?.file_digital ?? attachments[0]?.url ?? '',
    attachments,
    meta: item.meta ?? {},
    metabox: item.metabox ?? {},
    taxonomies: parse_wp_terms(item)
});

async function upload_media(file) {
    if (!(file instanceof File) || file.size === 0) return { data: null, error: null };
    const body = new FormData();
    body.append('file', file, file.name);
    return run(async () => {
        const { data } = await wpApi.post('/wp/v2/media', body);
        return { data: { id: data.id, url: data.source_url } };
    }, { data: null });
}

const create_cpt_service = (endpoint) => ({
    getAll: (per_page = 50) => // jika ingin diubah untuk data perhalaman disini
        // `getAll(per_page)`: `GET /wp/v2/${endpoint}?per_page=50&status=any&_embed=true` → mengambil daftar item beserta totalnya dari header `x-wp-total`.
        run(async () => {
            const res = await wpApi.get(`/wp/v2/${endpoint}`, {
                params: { per_page, status: 'any', _embed: true }
            });
            const items = res.data.map(parse_wp_post);
            return { items, total: Number(res.headers['x-wp-total'] || items.length) };
        }, { items: [], total: 0 }),

    get_by_id: (id) =>
        // `get_by_id(id)`: mengambil detail 1 item (`context=edit&_embed=true`) sekaligus file media lampirannya (`/wp/v2/media?parent=${id}`).
        run(async () => {
            const [res, media_res] = await Promise.all([
                wpApi.get(`/wp/v2/${endpoint}/${id}`, {
                    params: { context: 'edit', _embed: true }
                }),
                wpApi.get('/wp/v2/media', {
                    params: { parent: id, per_page: 10 }
                }).catch(() => ({ data: [] }))
            ]);

            const attachments = (media_res.data ?? []).map((m) => ({
                id: m.id,
                title: m.title?.rendered || m.source_url?.split('/').pop() || 'File',
                url: m.source_url,
                mime_type: m.mime_type ?? ''
            }));

            return { item: parse_wp_post(res.data, attachments) };
        }, { item: null }),

    async update_from_form(id, form_data) {
        // **`update_from_form(id, form_data)`**:
        // 1. Upload file gambar/dokumen baru jika user memilih file (`upload_media`).
        
        const title = form_data.get('title')?.toString().trim();
        if (!id || !title) return { error: 'ID dan judul wajib diisi.' };

        const [img_res, doc_res] = await Promise.all([
            upload_media(form_data.get('featured_image')),
            upload_media(form_data.get('attachment_file'))
        ]);

        if (img_res.error) return { error: `Upload gambar gagal: ${img_res.error}` };
        if (doc_res.error) return { error: `Upload file gagal: ${doc_res.error}` };

        const metabox = {};
        for (const [key, val] of form_data.entries()) {
            if (key.startsWith('meta_')) {
                //Mengumpulkan semua input yang namanya diawali `meta_` (contoh `meta_nomor_arsip`) ke dalam object `metabox`.
                const meta_key = key.slice(5);
                if (key.endsWith('[]')) {
                    const clean_key = meta_key.slice(0, -2);
                    (metabox[clean_key] ??= []).push(val.toString());
                } else {
                    metabox[meta_key] = val.toString().trim();
                }
            }
        }

        const tax_payload = {};
        for (const tax of TAXONOMIES[endpoint] ?? []) {
            tax_payload[tax.key] = form_data
                .getAll(`tax_${tax.key}`)
                //Mengumpulkan semua checkbox taxonomy yang diawali `tax_` (contoh `tax_archive-creator`) menjadi array ID angka (`[3, 7]`).
                .map((v) => Number(v))
                .filter((n) => Number.isFinite(n) && n > 0);
        }

        const payload = {
            title,
            content: form_data.get('content')?.toString() ?? '',
            status: form_data.get('status')?.toString() ?? 'publish', ...tax_payload, ...(Object.keys(metabox).length > 0 && { metabox }), ...(img_res.data && { featured_media: img_res.data.id }), ...(doc_res.data && { meta: { file_digital: doc_res.data.url } })
        };

        return run(async () => {
            await wpApi.post(`/wp/v2/${endpoint}/${id}`, payload);
            //Membungkus semuanya ke dalam `payload` (paket data) lalu mengirim `POST /wp/v2/${endpoint}/${id}`.
        });
    }
});

const parse_term = (t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ?? '',
    count: t.count ?? 0,
    parent: t.parent ?? 0
});

export const api_service = {
    archive: create_cpt_service('archive'),
    exhibition: create_cpt_service('exhibition'),
    lender: {
        getAll: (per_page = 50) => // jika ingin diubah untuk data perhalaman disini
            run(async () => {
                const res = await wpApi.get('/evrocks/v1/lender', { params: { per_page } });
                return { items: res.data, total: Number(res.headers['x-wp-total'] || res.data.length) };
            }, { items: [], total: 0 }),

        update_status: (id, { status, reason = '' }) => {
            if (!id || !status) return { error: 'ID dan status wajib diisi.' };
            return run(async () => {
                await wpApi.post(`/evrocks/v1/lender/${id}`, { status, reason });
            });
        }
    },
    taxonomy: {
        list: (tax, { page = 1, per_page = 20 } = {}) =>
            run(async () => {
                const res = await wpApi.get(`/wp/v2/${tax}`, {
                    params: { 
                        per_page: 100, 
                        hide_empty: false, 
                        orderby: 'name', 
                        order: 'asc',
                        _fields: 'id,name,slug,description,parent,count' 
                    }
                });
                return { 
                    items: res.data.map(parse_term),
                    total: Number(res.headers['x-wp-total']?? 1),
                    total_page: Number(res.headers['x-wp-totalpages']?? 1),
                    page
                 };
            }, { items: [], total: 0, total_page: 1, page }),

        create: (tax, { name, slug, description, parent }) => {
            if (!name) return { error: 'Nama term wajib diisi.' };
            return run(async () => {
                await wpApi.post(`/wp/v2/${tax}`, {
                    name,
                    ...(slug && { slug }),
                    ...(description && { description }),
                    ...(parent && { parent })
                });
            });
        },

        update: (tax, id, { name, slug, description, parent }) => {
            if (!id || !name) return { error: 'ID dan Nama term wajib diisi.' };
            return run(async () => {
                await wpApi.post(`/wp/v2/${tax}`, {
                    name,
                    ...(slug && { slug }),
                    ...(description && { description }),
                    ...(parent && { parent })
                });
            });
        },

        remove: (tax, id) => {
            if (!id) return { error: 'ID term wajib diisi.' };
            // term WordPress tidak punya Trash, jadi force wajib true
            return run(async () => {
                await wpApi.delete(`/wp/v2/${tax}/${id}`, { params: { force: true } });
            });
        }
    },
    users: {
        list: () => run(async () => {
            const res = await wpApi.get('/wp/v2/users?context=edit&per_page=100');
            return {
                items: res.data.map((u) => ({
                    id: u.id,
                    username: u.slug,
                    name: u.name,
                    email: u.email ?? '',
                    role: u.roles?.[0] ?? 'subscriber'
                }))
            };
        }, { items: [] }),
        create: (payload) => run(() => wpApi.post('/wp/v2/users', payload)),
        update_role: (id, role) => run(() => wpApi.post(`/wp/v2/users/${id}`, { roles: [role] })),
        remove: (id, reassign) => run(() => wpApi.delete(`/wp/v2/users/${id}`, { params: { force: true, reassign } }))
    }
};



export async function login(username, password) {
    if (!username || !password) {
        return {token: null, user: null, error: 'Username and Password requiered' };
    }

    try {
        const baseURL = wpApi.defaults.baseURL;
                // 1. Kirim username & password ke plugin JWT Tmeister untuk minta token
        const { data } = await axios.post(`${baseURL}/jwt-auth/v1/token`, {username, password});
                // 2. Pakai token tersebut sebagai tiket (Bearer) untuk menanyakan detail & role user yang login
        const me = await axios.get(`${baseURL}/wp/v2/users/me?context=edit`, {headers: {Authorization: `Bearer ${data.token}`}});

        return{
            token: data.token,
            user: {
                id: me.data.id,
                name: me.data.name,
                email: me.data.email ?? '',
                role: me.data.roles?.[0] ?? 'subscriber'
                // Ambil role pertama; jika kosong anggap 'subscriber'
            },
            error: null
        
        };
    } catch (err) {
        return {
            token: null,
            user: null,
            error: err.response?.data?.message || err.message
        };
    }
}