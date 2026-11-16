<script>
    // @ts-nocheck
    import * as Card from "#lib/components/ui/card/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    let { data } = $props();

    const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
</script>

<div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl font-semibold">Archive Repository</h1>
            <p class="text-xs text-muted-foreground">Koleksi dokumen dan rekaman arsip digital.</p>
        </div>
        <span class="text-sm text-muted-foreground">Total: {data.archives?.length ?? 0} item</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        {#each data.archives ?? [] as item (item.id)}
            <Card.Root class="flex flex-col justify-between overflow-hidden">
                <Card.Header class="space-y-2">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                        <span class="font-mono">#{item.id}</span>
                        <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <Card.Title class="text-base leading-snug">
                        <a href="/?tab=archive&view=detail&id={item.id}" class="hover:underline">
                            {@html item.title}
                        </a>
                    </Card.Title>
                    <Card.Description class="truncate">
                        {item.slug}
                    </Card.Description>
                </Card.Header>

                <Card.Content>
                    <p class="text-sm text-muted-foreground line-clamp-3">
                        {strip_html(item.content) || 'Tidak ada deskripsi arsip.'}
                    </p>
                </Card.Content>

                <Card.Footer class="border-t pt-3 flex items-center justify-between gap-2">
                    <span class="badge-status text-xs uppercase">{item.status}</span>
                    <div class="flex items-center gap-2 shrink-0">
                        <Button href="/archive/detail/{item.id}" variant="ghost" size="sm">
                            View
                        </Button>
                        <Button href="/archive/edit/{item.id}" variant="outline" size="sm">
                            Edit
                        </Button>
                    </div>
                </Card.Footer>
            </Card.Root>
        {:else}
            <div class="col-span-full p-6 border rounded-md text-center text-muted-foreground">
                Belum ada data archive.
            </div>
        {/each}
    </div>
</div>
