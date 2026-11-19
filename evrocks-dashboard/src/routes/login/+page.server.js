import { fail, redirect } from "@sveltejs/kit";
import  { login } from "#lib/api.js";

export const actions = {
    // Dipanggil oleh <form method="POST" action="?/login">
    login: async ({ request, cookies }) => {
        // 1. Ambil kertas formulir yang baru diisi user di layar  
        const form_data = await request.formData();
        // 2. Baca tulisan di kolom 'username' (trim = buang spasi tidak sengaja di awal/akhir)    
        const username = form_data.get('username')?.toString().trim();
        // 3. Baca tulisan di kolom 'password'       
        const password = form_data.get('password')?.toString();
         // 4. call WordPress lewat fungsi login() di api.js
        const { token, user, error } = await login(username, password);
        // Jika gagal login, kirim status 401 dan pesan error ke variabel `form` di +page.svelte
        if (error || !token || !user) return fail(401, { error: error || 'login failed' }); 

        // Simpan cookie session (SvelteKit otomatis memberi httpOnly: true & sameSite: 'lax')
        cookies.set('evrocks_session', JSON.stringify({ token, user }), {
            path:'/',
            maxAge: 60 * 60 * 24 * 7 // 7 hari
        });

        throw redirect(303, '/');
    },
    // Dipanggil oleh tombol Log out di sidebar (<form method="POST" action="/login?/logout">)
    logout: async({ cookies }) => {
        cookies.delete('evrocks_session', {path: '/'});
        throw redirect(303, '/login');
    }
};

// how to edit 
// Ubah lama waktu login: ganti `maxAge` di `cookies.set`.
