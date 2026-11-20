// @ts-nocheck

import { error, redirect } from '@sveltejs/kit';
import { verify_session } from '#lib/server/session.js';

const staff_routes = [ '/archive', '/exhibition', '/lender' ]

export async function handle({event, resolve}) {
    const raw = event.cookies.get('evrocks_session');
    if (raw) {
        const session = verify_session(raw);
        if (session?.user) {
            event.locals.user = session.user;
        } else {
            event.cookies.delete('evrocks_session', { path: '/' });
        }
    }

    const {pathname} = event.url;
    const is_login = pathname === '/login';

    if (!event.locals.user && !is_login) redirect(303, '/login');
    if (event.locals.user && is_login && event.request.method === 'GET' ) redirect(303, '/');

    const role = event.locals.user?.role;
    if (pathname.startsWith('/user') && role !== 'administrator') {
        error(403, 'Akses ditolak. Halaman ini khusus administrator')
    }
    if (staff_routes.some((prefix) => pathname.startsWith(prefix)) && role !== 'administrator' && role !== 'editor'){
        error(403, 'tolak');
    }
    const response = await resolve(event);
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
}