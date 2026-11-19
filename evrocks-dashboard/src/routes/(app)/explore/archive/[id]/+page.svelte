<script>
    // @ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';

    let { data } = $props();
    let archive = $derived(data.archive);
    let meta = $derived({ ...(archive.metabox??{}), ...(archive.meta ?? {})});
    let taxonomies = $derived(archive.taxonomies ?? {});

    const meta_fields = [
        ['Reference Code', 'code'],
        ['Archival Year', 'archive_year'],
        ['Archival Year', 'access_status'],
        ['Physical Condition', 'physical_condition'],
        ['Processing Unit', 'processing_unit'],
        ['Volume / Number', 'volume']
    ]
</script>

<!-- Kolom Kiri (2/3): Gambar, Judul, Deskripsi -->
<div class="max-w-5xl mx-auto w-full p-6 space-y-6">
    <div>
        <Button href="/explore/archive" variant="ghost" size="sm">Back to the Archive Catalog</Button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 item-start">
        {#if archive.featured_image_url}
  		    <div class="overflow-hidden rounded-lg border bg-muted">
    			<img 
                    src={archive.featured_image_url}
                    alt={archive.title}
                    class="w-full max-h-[460px] object-cover"
       			/>
            </div>
        {/if}

         <div class="space-y-3"> 
                <h1 class="text-2xl font-semibold tracking-tight">{@html archive.title}</h1>
                <p class="text-xs text-muted-foreground">Dipublikasikan {new Date(archive.date).toLocaleDateString('id-ID')}</p>
            <div class="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground/90pt-2">
    			{@html archive.content || '<p class="text-muted-foreground">Tidak ada deskripsi.</p>'} 
            </div>
		</div>
    </div>
<!-- Kolom Kanan (1/3): Metadata, Taxonomy Badge, Tombol Pinjam -->
    <div class="space-y-4">
        <Card.Root>
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Archive Information</Card.Title>
            </Card.Header>
        </Card.Root>
    </div>
</div>