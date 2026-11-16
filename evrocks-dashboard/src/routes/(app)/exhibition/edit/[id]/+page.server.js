import { error, fail, redirect } from "@sveltejs/kit";
import { api_service } from "#lib/api.js";
import { TAXONOMIES } from "#lib/taxonomies.js";

export async function load({params}) {
    const { item, error: err }
}