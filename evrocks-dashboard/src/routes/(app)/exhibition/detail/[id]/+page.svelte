<script>
    // @ts-nocheck
    import * as Card from "#lib/components/ui/card/index.js";
    import { Badge } from "#lib/components/ui/badge/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    import { TAXONOMIES } from "#lib/taxonomies.js";

    let { data } = $props();
    let exhibition = $derived(data.exhibition);
    let taxonomies = $derived(exhibition.taxonomies ?? {});
    let meta = $derived({ ...(exhibition.metabox ?? {}), ...(exhibition.meta ?? {}) });

    let files = $derived.by(() => {
        const list = [...(exhibition.attachments ?? [])];
        if (exhibition.file_digital && !list.some((f) => f.url === exhibition.file_digital)) {
            list.unshift({
                id: "digital",
                title: exhibition.file_digital.split("/").pop() || "Katalog Pameran",
                url: exhibition.file_digital,
                mime_type: exhibition.file_digital.toLowerCase().endsWith(".pdf") ? "application/pdf" : ""
            });
        }
        return list;
    });

    const is_image = (f) => f.mime_type?.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(f.url ?? "");
    const is_pdf = (f) => f.mime_type === "application/pdf" || /\.pdf$/i.test(f.url ?? "");
</script>

<div class="max-w-6xl mx-auto w-full p-6 space-y-6">
    <!-- Top Header & Quick Actions -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5">
        <div class="space-y-2 min-w-0">
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <a href="/exhibition" class="hover:underline">All Exhibitions</a>
                <span>/</span>
                <span class="font-mono">#{exhibition.id}</span>
            </div>

            <h1 class="text-2xl font-semibold tracking-tight leading-snug">{@html exhibition.title}</h1>

            <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge variant={exhibition.status === "publish" ? "default" : "secondary"} class="uppercase text-[11px]">
                    {exhibition.status}
                </Badge>
                {#if meta._kurator_pameran}
                    <Badge variant="outline" class="text-[11px]">Kurator: {meta._kurator_pameran}</Badge>
                {/if}
            </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
            {#if exhibition.status === "publish"}
                <Button href="/explore/exhibition/{exhibition.id}" variant="ghost" size="sm">Preview Katalog</Button>
            {/if}
            <Button href="/exhibition/edit/{exhibition.id}" size="sm">Edit Exhibition</Button>
            <Button href="/exhibition" variant="outline" size="sm">Back</Button>
        </div>
    </div>

    <!-- Main 2-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Left Column (2/3): Poster/Files & Curatorial Narrative -->
        <div class="lg:col-span-2 space-y-6">
            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Poster & Katalog Pameran</Card.Title>
                    <Card.Description>Pratinjau poster utama dan file katalog digital pameran.</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-4 pt-4">
                    {#if exhibition.featured_image_url}
                        <div class="overflow-hidden rounded-md border bg-muted/30">
                            <img
                                src={exhibition.featured_image_url}
                                alt={exhibition.raw_title}
                                class="w-full max-h-[440px] object-contain mx-auto"
                            />
                        </div>
                    {/if}

                    {#each files as file (file.id)}
                        <div class="space-y-3 rounded-md border bg-muted/20 p-4">
                            {#if is_image(file) && file.url !== exhibition.featured_image_url}
                                <img
                                    src={file.url}
                                    alt={file.title}
                                    class="w-full max-h-96 rounded-md border object-contain bg-background"
                                />
                            {:else if is_pdf(file)}
                                <iframe
                                    src={file.url}
                                    title={file.title}
                                    class="w-full h-[420px] rounded-md border bg-background"
                                ></iframe>
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
                            <div class="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                                Belum ada poster atau katalog terlampir.
                            </div>
                        {/if}
                    {/each}
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Curatorial Narrative</Card.Title>
                </Card.Header>
                <Card.Content class="pt-4">
                    <div class="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground">
                        {#if exhibition.content}
                            {@html exhibition.content}
                        {:else}
                            <p class="text-muted-foreground italic">Tidak ada narasi kuratorial.</p>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>
        </div>

        <!-- Right Column (1/3, sticky): Curatorial Info, Record Summary & Taxonomies -->
        <div class="space-y-6 lg:sticky lg:top-6">
            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Info Kuratorial & Jadwal</Card.Title>
                </Card.Header>
                <Card.Content class="pt-4 space-y-2.5 text-sm">
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Kurator</span>
                        <span class="font-medium text-right">{meta._kurator_pameran || "—"}</span>
                    </div>
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Tanggal Mulai</span>
                        <span>{meta._tanggal_mulai_pameran || "—"}</span>
                    </div>
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Tanggal Selesai</span>
                        <span>{meta._tanggal_selesai_pameran || "—"}</span>
                    </div>
                    <div class="flex justify-between gap-3 border-t pt-2.5">
                        <span class="text-muted-foreground">Slug</span>
                        <span class="font-mono text-xs truncate max-w-44" title={exhibition.slug}>{exhibition.slug}</span>
                    </div>
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Tanggal Input</span>
                        <span>{new Date(exhibition.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Taxonomy</Card.Title>
                    <Card.Description>Tema dan pengelompokan pameran.</Card.Description>
                </Card.Header>
                <Card.Content class="pt-4 space-y-3">
                    {#each TAXONOMIES.exhibition as tax (tax.key)}
                        {@const terms = taxonomies[tax.key] ?? []}
                        <div class="space-y-1.5 border-b pb-2.5 last:border-b-0 last:pb-0">
                            <div class="text-xs font-medium text-muted-foreground">{tax.label}</div>
                            <div class="flex flex-wrap gap-1.5">
                                {#each terms as term (term.id)}
                                    <Badge variant="secondary">{term.name}</Badge>
                                {:else}
                                    <span class="text-xs text-muted-foreground/60">—</span>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
