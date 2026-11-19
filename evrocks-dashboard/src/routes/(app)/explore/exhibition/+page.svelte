<script>
        // @ts-nocheck
        import * as Card from '#lib/components/ui/card/index.js';
        import { Badge } from '#lib/components/ui/badge/index.js';
        import { Button } from '#lib/components/ui/button/index.ts';
        import { Input } from '#lib/components/ui/input/index.ts';                                                                                           
        let { data } = $props();

        const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

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