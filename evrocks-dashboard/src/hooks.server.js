// @ts-nocheck

import { error, redirect } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { SESSION_SECRET } from '$env/static/private';

const staff_routes = [ '/archive', '/exhibition', '/lender' ]

export function sign_session(payload){
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    return `${data}.${sig}`;
}

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
    return resolve(event);
}