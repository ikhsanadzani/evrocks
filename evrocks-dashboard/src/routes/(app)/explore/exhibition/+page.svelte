<script>
    // @ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';

    let { data } = $props();
    const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
</script>

<div class="max-w-6xl mx-auto w-full p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">Catalog Exhibitions</h1>
            <p class="text-sm text-muted-foreground">Display {data.exhibitions.length} published exhibitions</p>
        </div>

        <form method="GET" class="flex items-center gap-2 w-full sm:w-auto">
            <Input name="q" value={data.q} placeholder="Search for an exhibition title..." class="sm:w-64 h-9" />
            <Button type="submit" size="sm" class="h-9">Search</Button>
            {#if data.q}
                <Button href="/explore/exhibition" variant="ghost" size="sm" class="h-9">Reset</Button>
            {/if}
        </form>
    </div>

    {#if data.error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            Failed to load the exhibition catalog: {data.error}
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each data.exhibitions as item (item.id)}
            <a href="/explore/exhibition/{item.id}" class="group block">
                <Card.Root class="h-full flex flex-col overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
                    <div class="aspect-video w-full bg-muted overflow-hidden border-b">
                        {#if item.featured_image_url}
                            <img
                                src={item.featured_image_url}
                                alt={strip_html(item.title)}
                                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        {:else}
                            <div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                No Preview
                            </div>
                        {/if}
                    </div>

                    <Card.Header class="space-y-1.5 pt-4">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            {#each item.taxonomies?.exhibition_theme ?? [] as term (term.id)}
                                <Badge variant="secondary" class="text-[11px]">{term.name}</Badge>
                            {/each}
                        </div>
                        <Card.Title class="text-base leading-snug group-hover:underline">
                            {@html item.title}
                        </Card.Title>
                    </Card.Header>

                    <Card.Content class="flex-1">
                        <p class="text-sm text-muted-foreground line-clamp-3">
                            {strip_html(item.content) || 'No description available.'}
                        </p>
                    </Card.Content>
                </Card.Root>
            </a>
        {:else}
            <div class="col-span-full p-10 border rounded-md text-center text-sm text-muted-foreground">
                No matching records were found.
            </div>
        {/each}
    </div>
</div>
