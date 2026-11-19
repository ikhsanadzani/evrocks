<script>
    // @ts-nocheck

    let { data } = $props();
    let archive = $derived(data.archive);
    let meta = $derived({ ...(archive.metabox??{}), ...(archive.meta ?? {})});
</script>

<div class="p-6 space-y-4">
    <a href="/explore/archive">Back to the Archive Catalog</a>

    <h1>{@html archive.title}</h1>
</div>