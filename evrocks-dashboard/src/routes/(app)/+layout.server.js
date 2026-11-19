// @ts-nocheck

export function load({locals}){
    // Mengoper data user dari (locals.user) ke +layout.svelte dan semua halaman di dalam (app)
    return {
        user: locals.user ?? null
    };
}