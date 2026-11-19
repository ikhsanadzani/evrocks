 // @ts-nocheck
    import { redirect } from '@sveltejs/kit';
  
    export async function handle({ event, resolve }) {
        // 1. Satpam meriksa saku browser: "Ada kartu login (cookie 'evrocks_session') nggak?"
        const raw = event.cookies.get('evrocks_session');
        // 2. Kalau ada kartu login-nya:  
        if (raw) {
            try {
                event.locals.user = JSON.parse(raw).user ?? null;
            } catch {                                                                                                                                             
    		event.cookies.delete('evrocks_session', { path: '/' });
            }
        }
  
        const is_login = event.url.pathname === '/login';
        if (!event.locals.user && !is_login) throw redirect(303, '/login');
        if (event.locals.user && is_login && event.request.method === 'GET') throw redirect(303, '/');                                                                                              
                                                                                                                                                                  
        return resolve(event);
    }