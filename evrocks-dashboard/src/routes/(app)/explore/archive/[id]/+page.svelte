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

<div class="max-w-5xl mx-auto w-full p-6 space-y-6">
    <div>
        <Button href="/explore/archive" variant="ghost" size="sm">Back to the Archive Catalog</Button>
    </div>
</div>