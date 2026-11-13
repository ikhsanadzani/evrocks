<script>
    // @ts-nocheck
    import { Button } from "#lib/components/ui/button/index.ts";
    let { data } = $props();
</script>

<div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Virtual Exhibitions</h1>
        <span class="text-sm text-muted-foreground">Total: {data.exhibitions?.length ?? 0} pameran</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each data.exhibitions ?? [] as item (item.id)}
            <div class="border rounded-md p-4 flex flex-col justify-between space-y-3 bg-card">
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span class="font-mono">#{item.id}</span>
                        <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    
                    <h2 class="font-semibold text-base">{@html item.title}</h2>
                    
                    <div class="text-sm text-muted-foreground line-clamp-3">
                        {@html item.content || 'Tidak ada deskripsi narasi.'}
                    </div>
                </div>

                <div class="pt-3 border-t flex items-center justify-between gap-2 text-xs">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="badge-status">{item.status}</span>
                        <span class="text-muted-foreground truncate">{item.slug}</span>
                    </div>
                    <Button href="/?tab=exhibition&view=edit&id={item.id}" variant="outline" size="sm">
                        Edit
                    </Button>
                </div>
            </div>
        {:else}
            <div class="col-span-full p-6 border rounded-md text-center text-muted-foreground">
                Belum ada data pameran virtual.
            </div>
        {/each}
    </div>
</div>