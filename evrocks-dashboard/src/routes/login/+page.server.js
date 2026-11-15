import { fail, redirect } from "@sveltejs/kit";
import  { login } from "#lib/api.js";

export const actions = {
    default: async ({ request, cookies }) => {
        const form_data = await request.formData();
        const username = form_data.get('username')?.toString().trim();
        const password = form_data.get('password')?.toString();

        const { token, user, error } = await login(username, password);
        if (error || !token || !user) return fail(401, { error: error || 'login failed' }); {
            
        }
    }
}