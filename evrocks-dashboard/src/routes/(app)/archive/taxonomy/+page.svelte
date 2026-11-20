<script>
    // @ts-nocheck
    import TaxonomyManager from '#lib/components/taxonomy-manager.svelte';
    let { data, form } = $props();
</script>

<TaxonomyManager
    tab="archive"
    taxonomy_list={data.taxonomy_list}
    active_taxonomy={data.active_taxonomy}
    terms={data.terms}
    total={data.total}
    total_pages={data.total_pages}
    page={data.page}
    terms_error={data.terms_error}
    {form}
/>
