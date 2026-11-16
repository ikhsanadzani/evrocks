    import { fail, redirect } from '@sveltejs/kit';                           
    import { api_service } from '#lib/api.js';                                
                                                                              
    export async function load() {                                            
        const result = await api_service.lender.getAll(50);                   
        return { loans: result.items };                                       
    }                                                                         
                                                                              
    export const actions = {                                                  
        update_lender: async ({ request }) => {                               
            const form_data = await request.formData();                       
            const id = form_data.get('id')?.toString();                       
            const status = form_data.get('status')?.toString();               
            const reason = form_data.get('reason')?.toString() ?? '';         
                                                                              
            const { error } = await api_service.lender.update_status(id, {    
            status, reason });                                                
            if (error) return fail(400, { error });                           
            throw redirect(303, '/lender');                                   
        }                                                                     
    };  