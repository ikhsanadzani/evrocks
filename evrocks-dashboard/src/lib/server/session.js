// @ts-nocheck
import crypto from 'node:crypto';
import { SESSION_SECRET } from '$env/static/private';

export function sign_session(payload) {
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    return `${data}.${sig}`;
}

export function verify_session(raw) {
    if (!raw || !raw.includes('.')) return null;
    const [data, sig] = raw.split('.');
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');

    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

    try {
        return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    } catch {
        return null;
    }
}
