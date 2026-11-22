<script>
    //@ts-nocheck
    import PostList from "#lib/components/post-list.svelte";
    let {data} = $props();
</script>

<PostList
        title="Virtual Exhibitions"
        subtitle="Khazanah pameran virtual dan kuratorial arsip."             
        unit="pameran"
        empty_text="Belum ada data pameran virtual."
        base_url="/exhibition"
        items={data.exhibitions ?? []}
        show_image={true}
    />