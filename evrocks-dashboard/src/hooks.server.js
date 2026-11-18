 // @ts-nocheck
    import { redirect } from '@sveltejs/kit';
  
    export async function handle({ event, resolve }) {
        const raw = event.cookies.get('evrocks_session');
        if (raw) {
            try {
                event.locals.user = JSON.parse(raw).user ?? null;
            } catch {                                                                                                                                             
    		event.cookies.delete('evrocks_session', { path: '/' });
            }
        }
  
        const is_login = event.url.pathname === '/login';
        if (!event.locals.user && !is_login) throw redirect(303, '/login');
        if (event.locals.user && is_login) throw redirect(303, '/');                                                                                              
                                                                                                                                                                  
        return resolve(event);
    }