import { api_service } from '#lib/api.js';

export async function load() {
    // Lu tinggal panggil nama endpoint-nya, sangat clean!
    const result = await api_service.exhibition.getAll(50);

    if (result.error) {
        console.warn(`[PageLoad] Error: ${result.error}`);
    }

    // Log ke terminal Host lu
    console.log("🔥 TEST PABRIK API JALAN, Total Data:", result.total);

    return {
        // Kita ubah nama 'items' menjadi 'exhibitions' buat dilempar ke UI
        exhibitions: result.items 
    };
}