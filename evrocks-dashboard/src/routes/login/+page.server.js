import { fail, redirect } from "@sveltejs/kit";
import  { login } from "#lib/api.js";

export const actions = {
    login: async ({ request, cookies }) => {
        const form_data = await request.formData();
        const username = form_data.get('username')?.toString().trim();
        const password = form_data.get('password')?.toString();

        const { token, user, error } = await login(username, password);
        if (error || !token || !user) return fail(401, { error: error || 'login failed' }); 

        cookies.set('evrocks_session', JSON.stringify({ token, user }), {
            path:'/',
            maxAge: 60 * 60 * 24 * 7
        });

        throw redirect(303, '/');
    },
    logout: async({ cookies }) => {
        cookies.delete('evrocks_session', {path: '/'});
        throw redirect(303, '/login');
    }
};