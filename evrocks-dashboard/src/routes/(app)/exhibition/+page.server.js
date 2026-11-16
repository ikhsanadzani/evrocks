import { api_service } from '#lib/api.js';

export async function load() {
    const result = await api_service.exhibition.getAll(50);

    if (result.error) {
        console.warn(`[PageLoad] Error: ${result.error}`);
    }

    console.log(" Total Data:", result.total);

    return {
        exhibitions: result.items 
    };
}