// @ts-nocheck
import { api_service } from '#lib/api.js';

export async function load({ locals }) {
    const user = locals.user;
    const is_staff = user?.role === 'administrator' || user?.role === 'editor';

    // Staff tidak perlu fetch loans di halaman overview dashboard
    if (is_staff) return { loans: [] };

    // Subscriber hanya melihat status peminjaman miliknya sendiri
    const res = await api_service.lender.getAll(50);
    const my_loans = res.items.filter(
        (item) => item.user_id === user?.id || (user?.email && item.email === user.email)
    );

    return { loans: my_loans };
}

//  • Dasarnya: SvelteKit Docs — Loading data (+page.server.js) https://svelte.dev/docs/kit/load#Page-data:        
//     export async function load({ locals }) {                                                                     
//         return { ... };                                                                                          
//     }                                                                                                            
                                                                                                                 
//   • Yang diubah: Menggunakan locals.user (yang sudah diisi hooks.server.js) untuk mengecek is_staff, lalu        
//   memfilter res.items berdasarkan user.id / user.email khusus untuk subscriber.                                  
//   • Alasannya: Pemfilteran dilakukan di server, sehingga data peminjaman milik user lain tidak pernah dikirim ke 
//   browser subscriber.  