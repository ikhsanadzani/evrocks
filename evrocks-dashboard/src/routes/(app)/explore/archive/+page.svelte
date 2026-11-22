<script>
    // @ts-nocheck
    import CatalogIndex from '#lib/components/catalog-index.svelte';

    let { data } = $props();

    const badges = (item) => [
        ...(item.metabox?.code ? [{ label: item.metabox.code, variant: 'outline', mono: true }] : []),
        ...(item.metabox?.archive_year ? [{ label: item.metabox.archive_year }] : [])
    ];
</script>

<CatalogIndex
    title="Catalog Archives"
    base_url="/explore/archive"
    items={data.archives}
    q={data.q}
    error={data.error}
    placeholder="Search for a title or archive code..."
    {badges}
/>


