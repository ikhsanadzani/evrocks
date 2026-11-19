   // @ts-nocheck                                                                                                                                                
    import { error, fail, redirect } from '@sveltejs/kit';                                                                                                        
    import { api_service } from '#lib/api.js';                                                                                                                    
                                                                                                                                                                  
    export async function load({ locals }) { 
        // 1. cek apakah ini administrator atau bukan, jkia bukan maka akan dilempar ke 404 dan memberikan pesan akses ditolak                                                                                                                    
        if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');                                                                            
        // 2. Kalau benar administrator, minta daftar semua user ke WordPres
        const res = await api_service.users.list();     
        // 3. Kirim daftar user (users) dan pesan error jika ada (users_error) ke layar +page.svelte                                                                                                          
        return { users: res.items, users_error: res.error };                                                                                                      
    }                                                                                                                                                             
                                                                                                                                                                  
    export const actions = {
        // TOMBOL 1: Tambah User Baru
        create_user: async ({ request, locals }) => {
            // Cek lagi: wajib administrator
            if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');
            // Ambil isi form tambah user yang diketik admin
            const f = await request.formData();
            // WordPress bikin user baru sesuai isi form
            const { error: err } = await api_service.users.create({
                username: f.get('username'),
                name: f.get('name'),
                email: f.get('email'),
                password: f.get('password'),
                roles: [f.get('role') || 'subscriber'] // Jabatan user baru (default: subscriber)             
            });
            // Kalau gagal (misal username/email sudah dipakai orang lain), kirim pesan error ke layar          
            if (err) return fail(400, { error: err });
            // Kalau sukses, refresh halaman '/users' supaya user baru muncul di tabel
            throw redirect(303, '/users');
        },
        update_role: async ({ request, locals }) => {
            if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');
            const f = await request.formData();
            // Ambil ID user yang mau diubah + role barunya dari dropdown, lalu kirim ke WordPress
            const { error: err } = await api_service.users.update_role(f.get('id'), f.get('role'));
            if (err) return fail(400, { error: err });
            throw redirect(303, '/users');
        },
        delete_user: async ({ request, locals }) => {
            if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');
            // Ambil ID user yang mau dihapus dari input hidden di baris tabel tersebut
            const id = (await request.formData()).get('id');

            // Suruh WordPress hapus user itu, dan oper semua arsip/post peninggalannya ke ID admin yang sedang  
            // login (locals.user.id)
            const { error: err } = await api_service.users.remove(id, locals.user.id);
            if (err) return fail(400, { error: err });
            throw redirect(303, '/users');
        }
    };