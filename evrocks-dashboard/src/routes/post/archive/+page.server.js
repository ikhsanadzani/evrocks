import { archive_service } from "#lib/services/archive.service.js";

export async function load() {
    const result = await archive_service.getAll(50);

    console.log("Total Data:", result.total);

    if (result.error) {
        console.warn('Saat memuat arsip: ${result.error}');
    }
    return {
        archives: result.archives,
        total: result.total
    };
}