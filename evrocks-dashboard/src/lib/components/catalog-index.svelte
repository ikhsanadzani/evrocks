<script>
    // @ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';

    // title    : judul halaman
    // base_url : alamat dasar katalog, contoh '/explore/archive'
    // items    : daftar arsip / pameran
    // badges   : fungsi (item) => [{ label, variant, mono }] untuk badge di atas judul kartu
    let { title, base_url, items = [], q = '', error = null, placeholder = 'Search...', badges = () => [] } = $props();

    const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // 1. (html ?? '') → Pengaman kalau html kosong (null/undefined), ganti jadi string kosong ''.
    // 2. .replace(/<[^>]*>/g, ' ') → Hapus semua tag HTML (<p>, </p>, <b>, dll) dan ganti jadi spasi.
    // 3. .replace(/\s+/g, ' ') → Gabungkan spasi/enter yang dobel-dobel jadi 1 spasi saja.
    // 4. .trim() → Buang spasi sisa di awal dan ujung kalimat.
</script>

<div class="max-w-6xl mx-auto w-full p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
            <p class="text-sm text-muted-foreground">Display {items.length} published items</p>
        </div>

        <form method="GET" class="flex items-center gap-2 w-full sm:w-auto">
            <Input name="q" value={q} {placeholder} class="sm:w-64 h-9" />
            <Button type="submit" size="sm" class="h-9">Search</Button>
            {#if q}
                <Button href={base_url} variant="ghost" size="sm" class="h-9">Reset</Button>
            {/if}
        </form>
    </div>

    {#if error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            Failed to load the catalog: {error}
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each items as item (item.id)}
            <a href="{base_url}/{item.id}" class="group block">
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
                            {#each badges(item) as b, i (i)}
                                <Badge variant={b.variant ?? 'secondary'} class="text-[11px] {b.mono ? 'font-mono' : ''}">
                                    {b.label}
                                </Badge>
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
