<script>
    // @ts-nocheck
    import * as Card from "#lib/components/ui/card/index.js";
    import { Badge } from "#lib/components/ui/badge/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    import { TAXONOMIES } from "#lib/taxonomies.js";

    let { data } = $props();
    let archive = $derived(data.archive);
    let taxonomies = $derived(archive.taxonomies ?? {});
    let meta = $derived({ ...(archive.metabox ?? {}), ...(archive.meta ?? {}) });

    const VALUE_LABELS = {
        hr: "Human Resources",
        finance: "Finance",
        it: "Information Technology",
        authentic: "Authentic (Verified)",
        unauthenticated: "Unauthenticated",
        original: "Original",
        copy: "Copy",
        cc: "Carbon Copy (CC)",
        draft: "Draft",
        good: "Good (Intact & Legible)",
        partially_damaged: "Partially Damaged",
        damaged: "Damaged (Needs Conservation)",
        open: "Open (Public)",
        restricted: "Restricted (Internal)",
        confidential: "Confidential",
        top_secret: "Top Secret",
        permanent: "Permanent Preservation",
        destroy: "Scheduled Destruction",
        review: "Re-evaluate",
        yes: "Available",
        no: "Excluded"
    };

    const format_val = (key, val) => {
        if (val === undefined || val === null || val === "") return null;
        if (key === "active_retention" || key === "inactive_retention") return `${val} tahun`;
        return VALUE_LABELS[val] ?? val;
    };

    const meta_groups = [
        {
            title: "Identity & Provenance",
            fields: [
                ["Reference Code", "code"],
                ["Primary Domain", "classification"],
                ["Classification Code", "classification_code"],
                ["File / Item Number", "file_number"],
                ["Document Date", "date"],
                ["Archive Year", "archive_year"],
                ["Processing Unit", "processing_unit"],
                ["Volume & Extent", "volume"]
            ]
        },
        {
            title: "Physical Condition & Access",
            fields: [
                ["Authenticity", "authenticity"],
                ["Development Status", "development_status"],
                ["Physical Condition", "physical_condition"],
                ["Storage Location", "storage_location"],
                ["Access Classification", "access_status"],
                ["Virtual Exhibition", "exhibition_available"]
            ]
        },
        {
            title: "Retention & Dublin Core",
            fields: [
                ["Active Retention", "active_retention"],
                ["Inactive Retention", "inactive_retention"],
                ["Final Disposition", "follow_up"],
                ["Subject (Dublin Core)", "dc_subject"],
                ["Contributor (Dublin Core)", "dc_contributor"]
            ]
        }
    ];

    let files = $derived.by(() => {
        const list = [...(archive.attachments ?? [])];
        if (archive.file_digital && !list.some((f) => f.url === archive.file_digital)) {
            list.unshift({
                id: "digital",
                title: archive.file_digital.split("/").pop() || "File Digital",
                url: archive.file_digital,
                mime_type: archive.file_digital.toLowerCase().endsWith(".pdf") ? "application/pdf" : ""
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
                <a href="/archive" class="hover:underline">All Archives</a>
                <span>/</span>
                <span class="font-mono">#{archive.id}</span>
            </div>

            <h1 class="text-2xl font-semibold tracking-tight leading-snug">{@html archive.title}</h1>

            <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge variant={archive.status === "publish" ? "default" : "secondary"} class="uppercase text-[11px]">
                    {archive.status}
                </Badge>
                {#if meta.code}
                    <Badge variant="outline" class="font-mono text-[11px]">{meta.code}</Badge>
                {/if}
                {#if meta.access_status}
                    <Badge variant="outline" class="text-[11px]">
                        {format_val("access_status", meta.access_status)}
                    </Badge>
                {/if}
                {#if meta.authenticity}
                    <Badge variant="secondary" class="text-[11px]">
                        {format_val("authenticity", meta.authenticity)}
                    </Badge>
                {/if}
            </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
            {#if archive.status === "publish"}
                <Button href="/explore/archive/{archive.id}" variant="ghost" size="sm">Preview Katalog</Button>
            {/if}
            <Button href="/archive/edit/{archive.id}" size="sm">Edit Archive</Button>
            <Button href="/archive" variant="outline" size="sm">Back</Button>
        </div>
    </div>

    <!-- Main 2-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Left Column (2/3): Media Preview, Description, Grouped Specifications -->
        <div class="lg:col-span-2 space-y-6">
            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Digital Archive File</Card.Title>
                    <Card.Description>Pratinjau gambar utama dan lampiran dokumen digital.</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-4 pt-4">
                    {#if archive.featured_image_url}
                        <div class="overflow-hidden rounded-md border bg-muted/30">
                            <img
                                src={archive.featured_image_url}
                                alt={archive.raw_title}
                                class="w-full max-h-[440px] object-contain mx-auto"
                            />
                        </div>
                    {/if}

                    {#each files as file (file.id)}
                        <div class="space-y-3 rounded-md border bg-muted/20 p-4">
                            {#if is_image(file) && file.url !== archive.featured_image_url}
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
                        {#if !archive.featured_image_url}
                            <div class="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                                Belum ada file digital terlampir.
                            </div>
                        {/if}
                    {/each}
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Deskripsi Arsip</Card.Title>
                </Card.Header>
                <Card.Content class="pt-4">
                    <div class="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground">
                        {#if archive.content}
                            {@html archive.content}
                        {:else}
                            <p class="text-muted-foreground italic">Tidak ada deskripsi arsip.</p>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Grouped Metadata Specifications (All 19 Metabox Fields) -->
            {#each meta_groups as group (group.title)}
                <Card.Root>
                    <Card.Header class="border-b pb-3">
                        <Card.Title class="text-base">{group.title}</Card.Title>
                    </Card.Header>
                    <Card.Content class="pt-4">
                        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            {#each group.fields as [label, key] (key)}
                                {@const val = format_val(key, meta[key])}
                                <div class="border-b pb-2">
                                    <dt class="text-xs text-muted-foreground">{label}</dt>
                                    <dd class={val ? "font-medium mt-0.5" : "text-muted-foreground/60 mt-0.5"}>
                                        {val ?? "—"}
                                    </dd>
                                </div>
                            {/each}
                        </dl>
                    </Card.Content>
                </Card.Root>
            {/each}
        </div>

        <!-- Right Column (1/3, sticky): Quick Info & Taxonomies -->
        <div class="space-y-6 lg:sticky lg:top-6">
            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Ringkasan Rekod</Card.Title>
                </Card.Header>
                <Card.Content class="pt-4 space-y-2.5 text-sm">
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Record ID</span>
                        <span class="font-mono font-medium">#{archive.id}</span>
                    </div>
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Slug</span>
                        <span class="font-mono text-xs truncate max-w-44" title={archive.slug}>{archive.slug}</span>
                    </div>
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Tanggal Input</span>
                        <span>{new Date(archive.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div class="flex justify-between gap-3">
                        <span class="text-muted-foreground">Lampiran</span>
                        <span>{files.length} file</span>
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="border-b pb-3">
                    <Card.Title class="text-base">Taxonomy</Card.Title>
                    <Card.Description>Klasifikasi dan metadata taxonomy arsip.</Card.Description>
                </Card.Header>
                <Card.Content class="pt-4 space-y-3">
                    {#each TAXONOMIES.archive as tax (tax.key)}
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
