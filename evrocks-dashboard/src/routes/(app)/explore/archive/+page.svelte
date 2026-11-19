<script>
// ts-nocheck
    let {data} = $props();
</script>

<div class="p-6 space-y-4">
    <h1> Catalog Archive ({data.archives.length})</h1>

    {#if data.error}
        <p>{data.error}</p>
    {/if}

    <ul>
        {#each data.archives as item (item.id)}
            <li>
                <a href="/explore/archve/{item.id}">{@html item.title}</a>
            </li>

            {:else}
                <li>Archive not found</li>
        {/each}
    </ul>
</div>