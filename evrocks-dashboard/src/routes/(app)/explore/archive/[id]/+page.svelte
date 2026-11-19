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

<div class="p-6 space-y-4">
    <a href="/explore/archive">Back to the Archive Catalog</a>

    <h1>{@html archive.title}</h1>
    <p>Published: {new Date(archive.date).toLocaleDateString('id-ID')}</p>

    {#if archive.featured_image_url}
        <img src={archive.featured_image_url} alt={archive.title} class="max-w-md" />
    {/if}

    <div>
        {@html archive.content || '<p>No description</p>'}
    </div>

     <ul>
        <li>Reference Code: {meta.code || '-'}</li>
        <li>Archive Year: {meta.archive_year || '-'}</li>
        <li>Access Status: {meta.access_status || '-'}</li>
    </ul>
</div>