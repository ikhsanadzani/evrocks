<script>
    // @ts-nocheck
    import * as Card from "#lib/components/ui/card/index.js";
    import { Badge } from "#lib/components/ui/badge/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    import { TAXONOMIES } from "#lib/taxonomies.js";

    let { data } = $props();
    let taxonomies = $derived(data.archive.taxonomies ?? {});
</script>

<div class="max-w-3xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between border-b pb-4">
        <div class="space-y-1">
            <div class="flex items-center gap-2">
                <span class="font-mono text-xs text-muted-foreground">#{data.archive.id}</span>
                <span class="badge-status uppercase text-xs">{data.archive.status}</span>
            </div>
            <h1 class="text-2xl font-semibold">{@html data.archive.title}</h1>
            <p class="text-xs text-muted-foreground">
                Slug: {data.archive.slug} &bull; {new Date(data.archive.date).toLocaleDateString('id-ID')}
            </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
            <Button href="/?tab=archive&view=edit&id={data.archive.id}" size="sm">Edit</Button>
            <Button href="/?tab=archive" variant="outline" size="sm">Back</Button>
        </div>
    </div>

    <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <Card.Content class="space-y-5 pt-6">
            {#if data.archive.featured_image_url}
                <img
                    src={data.archive.featured_image_url}
                    alt={data.archive.raw_title}
                    class="w-full max-h-80 rounded-md border object-cover"
                />
            {/if}

            {#if data.archive.file_digital}
                <div class="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-3 text-sm">
                    <span class="font-medium">File Digital / Dokumen Arsip</span>
                    <Button href={data.archive.file_digital} target="_blank" rel="noreferrer" variant="outline" size="sm">
                        Buka Dokumen
                    </Button>
                </div>
            {/if}

            <div class="prose prose-sm max-w-none text-foreground">
                {#if data.archive.content}
                    {@html data.archive.content}
                {:else}
                    <p class="text-muted-foreground">Tidak ada deskripsi arsip.</p>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>

    <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <Card.Header class="border-b pb-3">
            <Card.Title class="text-base">Taxonomy</Card.Title>
            <Card.Description>Klasifikasi dan metadata taxonomy arsip.</Card.Description>
        </Card.Header>
        <Card.Content class="pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {#each TAXONOMIES.archive as tax (tax.key)}
                    {@const terms = taxonomies[tax.key] ?? []}
                    <div class="space-y-1.5">
                        <div class="text-xs font-medium text-muted-foreground">{tax.label}</div>
                        <div class="flex flex-wrap gap-1.5">
                            {#each terms as term (term.id)}
                                <Badge variant="secondary">{term.name}</Badge>
                            {:else}
                                <span class="text-xs text-muted-foreground">-</span>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
</div>
