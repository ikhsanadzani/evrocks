<script>
    // @ts-nocheck
    let { data } = $props();
    let exhibition = $derived(data.exhibition);
</script>
  
    <div class="p-6 space-y-4">
        <a href="/explore/exhibition">← Kembali ke Pameran Virtual</a>
  
        <h1>{@html exhibition.title}</h1>
  	<p>Dipublikasikan: {new Date(exhibition.date).toLocaleDateString('id-ID')}</p>
  
  	{#if exhibition.featured_image_url} 
  	    <img src={exhibition.featured_image_url} alt={exhibition.title} class="max-w-lg" />
	{/if}
  
	<div>
            {@html exhibition.content || '<p>Tidak ada narasi pameran.</p>'}
	</div>
  
        <h2>Arsip dalam Pameran ({data.related_archives.length})</h2>
        <ul>
            {#each data.related_archives as arc (arc.id)} 
                <li>
                    <a href="/explore/archive/{arc.id}">{@html arc.title}</a>
		</li>
            {:else}
                <li>Belum ada arsip yang ditautkan ke pameran ini.</li>
            {/each}
        </ul>
    </div>