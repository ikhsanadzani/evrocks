import { fail, redirect } from "@sveltejs/kit";
import  { login } from "#lib/api.js";

export const actions = {
    // Dipanggil oleh <form method="POST" action="?/login">
    login: async ({ request, cookies }) => {
        const form_data = await request.formData();
        const username = form_data.get('username')?.toString().trim();
        const password = form_data.get('password')?.toString();

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
