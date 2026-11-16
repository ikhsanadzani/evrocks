import { api_service } from "#lib/api.js";

export async function load() {
    const result = await api_service.archive.getAll(50);

    console.log("Total Data:", result.total);

    if (result.error) {
        console.warn(`Saat memuat arsip: ${result.error}`);
    }
    return {
        archives: result.items,
        total: result.total
    };
}