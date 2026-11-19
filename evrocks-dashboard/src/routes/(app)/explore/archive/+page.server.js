// @ts-nocheck
import { api_service } from "#lib/api.js";
import { error } from "@sveltejs/kit";

export async function load() {
    const res = await api_service.archive.getAll(50);
    const archives = res.items.filter((item) => item.status === 'publish');

    return {archives, error: res.error};
}