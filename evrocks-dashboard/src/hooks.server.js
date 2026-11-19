 // @ts-nocheck
    import { redirect } from '@sveltejs/kit';
  
    export async function handle({ event, resolve }) {
    // 1. Cek apakah browser membawa cookie 'evrocks_session'
        const raw = event.cookies.get('evrocks_session');
    // 2. Bongkar isi JSON cookie, simpan profil user ke event.locals.user
        if (raw) {
            try {
                event.locals.user = JSON.parse(raw).user ?? null;
            } catch {   
    // Kalau isi cookie rusak, hapus cookie-nya                                                                                                                                          
    		event.cookies.delete('evrocks_session', { path: '/' });
            }
        }
  
        const is_login = event.url.pathname === '/login';
            // 3. Belum login tapi mau masuk ke halaman dalam -> lempar ke /login
        if (!event.locals.user && !is_login) throw redirect(303, '/login');
            // 4. Sudah login tapi buka halaman GET /login -> lempar ke /
            //    (Hanya dicegat saat method === 'GET' supaya POST /login?/logout tetap bisa jalan)
        if (event.locals.user && is_login && event.request.method === 'GET') throw redirect(303, '/');                                                                                              
            // 5. Lolos pemeriksaan -> lanjutkan ke halaman tujuan                                                                                                                                          
        return resolve(event);
    }