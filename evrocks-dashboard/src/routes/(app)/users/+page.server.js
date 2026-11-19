   // @ts-nocheck                                                                                                                                                
    import { error, fail, redirect } from '@sveltejs/kit';                                                                                                        
    import { api_service } from '#lib/api.js';                                                                                                                    
                                                                                                                                                                  
    export async function load({ locals }) {                                                                                                                      
        if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');                                                                            
        const res = await api_service.users.list();                                                                                                               
        return { users: res.items, users_error: res.error };                                                                                                      
    }                                                                                                                                                             
                                                                                                                                                                  
    export const actions = {
        create_user: async ({ request, locals }) => {
            if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');
            const f = await request.formData();
            const { error: err } = await api_service.users.create({
                username: f.get('username'),
                name: f.get('name'),
                email: f.get('email'),
                password: f.get('password'),
                roles: [f.get('role') || 'subscriber']
            });
            if (err) return fail(400, { error: err });
            throw redirect(303, '/users');
        },
        update_role: async ({ request, locals }) => {
            if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');
            const f = await request.formData();
            const { error: err } = await api_service.users.update_role(f.get('id'), f.get('role'));
            if (err) return fail(400, { error: err });
            throw redirect(303, '/users');
        },
        delete_user: async ({ request, locals }) => {
            if (locals.user?.role !== 'administrator') throw error(403, 'Akses ditolak.');
            const id = (await request.formData()).get('id');
            const { error: err } = await api_service.users.remove(id, locals.user.id);
            if (err) return fail(400, { error: err });
            throw redirect(303, '/users');
        }
    };