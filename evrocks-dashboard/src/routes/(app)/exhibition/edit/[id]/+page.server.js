// @ts-nocheck

import { error, fail, redirect } from '@sveltejs/kit';                    
import { api_service } from '#lib/api.js';                                
import { TAXONOMIES } from '#lib/taxonomies.js';                          
                                                                            
export async function load({ params }) {                                  
    const { item, error: err } = await                                    
    api_service.exhibition.get_by_id(params.id);                          
    if (!item) throw error(404, err || 'Exhibition tidak ditemukan');     
                                                                            
    const archive_res = await api_service.archive.getAll(50);             
                                                                            
    const taxonomy_terms = {};                                            
    for (const tax of TAXONOMIES.exhibition) {                            
        const res = await api_service.taxonomy.list(tax.key);             
        taxonomy_terms[tax.key] = res.items;                              
    }                                                                     
                                                                            
    return {                                                              
        exhibition: item,                                                 
        archives: archive_res.items,                                      
        taxonomy_terms                                                    
    };                                                                    
}                                                                         
                                                                            
export const actions = {                                                  
    update_exhibition: async ({ request, params }) => {                   
        const form_data = await request.formData();
        const { error: err } = await
        api_service.exhibition.update_from_form(params.id, form_data);    
        if (err) return fail(400, { error: err });
        throw redirect(303, '/exhibition');
    }
};