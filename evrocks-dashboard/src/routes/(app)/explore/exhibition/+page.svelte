<script>
        // @ts-nocheck                                                                                           
        let { data } = $props();
</script>

<div class="p-6 space-y-4">
    <h1>Pameran Virtual ({data.exhibitions.length})</h1>

    {#if data.error}
        <p>{data.error}</p>                                                                                  
    {/if}

    <ul>
        {#each data.exhibitions as item (item.id)}
            <li>
                <a href="/explore/exhibition/{item.id}">{@html item.title}</a>
            </li>
        {:else}
            <li>Belum ada pameran virtual terpublikasi.</li>
        {/each}
    </ul>
</div>