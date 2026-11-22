<script>
    // @ts-nocheck
    import CatalogIndex from '#lib/components/catalog-index.svelte';

    let { data } = $props();

    const badges = (item) => (item.taxonomies?.exhibition_theme ?? []).map((t) => ({ label: t.name }));
</script>

<CatalogIndex
    title="Catalog Exhibitions"
    base_url="/explore/exhibition"
    items={data.exhibitions}
    q={data.q}
    error={data.error}
    placeholder="Search for an exhibition title..."
    {badges}
/>
