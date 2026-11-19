// @ts-nocheck

import { error, redirect } from '@sveltejs/kit';

const staff_routes = [ '/archive', '/exhibition', '/lender' ]

export async function handle({event, resolve}) {
    const raw = event.cookies.get('evrocks_session');
    if (raw) {
        try {
            event.locals.user = JSON.parse(raw).user?? null;
        } catch {
            event.cookies.delete('evrocks_session', { path: '/' });
        }
    }

    const {pathname} = event.url;
    const is_login = path === '/login';

    if (!event.locals.user && !is_login) redirect(303, '/login');
    if (event.locals.user && is_login && event.reques.method === 'GET' ) redirect(303, '/');

    const role = event.locals.user?.role;
    if (pathname.startsWith('/user') && role !== 'administrator') {
        error(403, 'Akses ditolak. Halaman ini khusus administrator')
    }
    if (staff_routes.some((prefix) => pathname.startsWith(prefix)) && role !== 'administrator' && role !== 'editor'){
        error(403, 'tolak');
    }
    return resolve(event);
}