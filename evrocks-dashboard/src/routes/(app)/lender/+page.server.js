import { api_service } from '#lib/api.js';

export async function load() {
    const result = await api_service.lender.getAll(50);

    if (result.error) {
        console.warn(`[PageLoad] Error: ${result.error}`);
    }

    console.log(" Total Data peminjaman:", result.total);

    return {
        loans: result.items
    };
}