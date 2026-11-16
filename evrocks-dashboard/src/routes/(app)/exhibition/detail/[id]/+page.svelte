<script>
    // @ts-nocheck
    import * as Card from "#lib/components/ui/card/index.js";
    import { Badge } from "#lib/components/ui/badge/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    import { TAXONOMIES } from "#lib/taxonomies.js";

    let { data } = $props();
    let exhibition = $derived(data.exhibition);
    let taxonomies = $derived(exhibition.taxonomies ?? {});

    let files = $derived.by(() => {
        const list = [...(exhibition.attachments ?? [])];
        if (exhibition.file_digital && !list.some((f) => f.url === exhibition.file_digital)) {
            list.unshift({
                id: 'digital',
                title: exhibition.file_digital.split('/').pop() || 'Katalog Pameran',
                url: exhibition.file_digital,
                mime_type: exhibition.file_digital.toLowerCase().endsWith('.pdf') ? 'application/pdf' : ''
            });
        }
        return list;
    });

    const is_image = (f) => f.mime_type?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(f.url ?? '');
    const is_pdf = (f) => f.mime_type === 'application/pdf' || /\.pdf$/i.test(f.url ?? '');
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between border-b pb-4">
        <div class="space-y-1">
            <div class="flex items-center gap-2">
                <span class="font-mono text-xs text-muted-foreground">#{exhibition.id}</span>
                <span class="badge-status uppercase text-xs">{exhibition.status}</span>
            </div>
            <h1 class="text-2xl font-semibold">{@html exhibition.title}</h1>
            <p class="text-xs text-muted-foreground">
                Slug: {exhibition.slug} &bull; {new Date(exhibition.date).toLocaleDateString('id-ID')}
            </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
            <Button href="/?tab=exhibition&view=edit&id={exhibition.id}" size="sm">Edit</Button>
            <Button href="/?tab=exhibition" variant="outline" size="sm">Back</Button>
        </div>
    </div>

    <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <Card.Header class="border-b pb-3">
            <Card.Title class="text-base">Taxonomy</Card.Title>
            <Card.Description>Tema dan pengelompokan pameran.</Card.Description>
        </Card.Header>
        <Card.Content class="pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {#each TAXONOMIES.exhibition as tax (tax.key)}
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

    <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <Card.Header class="border-b pb-3">
            <Card.Title class="text-base">Poster & Katalog Pameran</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4 pt-4">
            {#if exhibition.featured_image_url}
                <img
                    src={exhibition.featured_image_url}
                    alt={exhibition.raw_title}
                    class="w-full max-h-96 rounded-md border object-cover"
                />
            {/if}

            {#each files as file (file.id)}
                <div class="space-y-3 rounded-md border bg-muted/30 p-4">
                    {#if is_image(file) && file.url !== exhibition.featured_image_url}
                        <img src={file.url} alt={file.title} class="w-full max-h-96 rounded-md border object-contain bg-background" />
                    {:else if is_pdf(file)}
                        <iframe src={file.url} title={file.title} class="w-full h-96 rounded-md border bg-background"></iframe>
                    {/if}
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0">
                            <div class="text-sm font-medium truncate">{file.title}</div>
                            {#if file.mime_type}
                                <div class="text-xs text-muted-foreground">{file.mime_type}</div>
                            {/if}
                        </div>
                        <Button href={file.url} target="_blank" rel="noreferrer" variant="outline" size="sm" class="shrink-0">
                            Buka / Download
                        </Button>
                    </div>
                </div>
            {:else}
                {#if !exhibition.featured_image_url}
                    <p class="text-sm text-muted-foreground">Belum ada poster atau katalog terlampir.</p>
                {/if}
            {/each}
        </Card.Content>
    </Card.Root>

    <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <Card.Header class="border-b pb-3">
            <Card.Title class="text-base">Curatorial Narrative</Card.Title>
        </Card.Header>
        <Card.Content class="pt-4">
            <div class="prose prose-sm max-w-none text-foreground">
                {#if exhibition.content}
                    {@html exhibition.content}
                {:else}
                    <p class="text-muted-foreground">Tidak ada narasi kuratorial.</p>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</div>
