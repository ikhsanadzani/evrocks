<script>
    // @ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';
    import { TAXONOMIES } from '#lib/taxonomies.js';

    let { data } = $props();
    let archive = $derived(data.archive);
    let meta = $derived({ ...(archive.metabox??{}), ...(archive.meta ?? {})});
    let taxonomies = $derived(archive.taxonomies ?? {});

    const meta_fields = [
        ['Reference Code:', 'code'],
        ['Archival Year:', 'archive_year'],
        ['Archival Year:', 'access_status'],
        ['Physical Condition:', 'physical_condition'],
        ['Processing Unit:', 'processing_unit'],
        ['Volume / Number:', 'volume']
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
            <Card.Content class="pt-4 space-y-3 text-sm">
                {#each meta_fields as [label, key] (key)}
                    <div class="flex justify-between gap-4 border-b pb-2 last:border-b-0 last:pb-0">     
                        <span class="text-muted-foreground">{label}</span>
                        <span class="font-medium text-right">{meta[key] || '-'}</span>
                    </div>
    			{/each}
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Classification & Taxonomy</Card.Title>
            </Card.Header>
            
            <Card.Content>
                {#each TAXONOMIES.archive as tax (tax.key)}
                    {@const terms = taxonomies[tax.key] ?? []} 
                    {#if terms.length > 0} 
  			            <div class="space-y-1">
  				            <div class="text-xs text-muted-foreground">{tax.label}</div>
                            <div class="flex flex-wrap gap-1.5"> 
                                    {#each terms as term (term.id)}
                                        <Badge variant="secondary">{term.name}</Badge>
                                    {/each}
                                    </div>
  		                        </div>
                            {/if} 
                        {/each}
            </Card.Content>
        </Card.Root>

        <Button href="/?pinjam={encodeURIComponent(archive.raw_title || archive.title)}" class="w-full">
                    Ajukan Peminjaman Arsip Ini                                                                  
        </Button>
    </div>
</div>