// @ts-nocheck

export function load({locals}){
    return {
        user: locals.user ?? null
    };
}