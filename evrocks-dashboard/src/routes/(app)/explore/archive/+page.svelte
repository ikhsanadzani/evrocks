<script>
// ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';

    let {data} = $props();
    const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // 1. (html ?? '') → Pengaman kalau html kosong (null/undefined), ganti jadi string kosong ''.
    // 2. .replace(/<[^>]*>/g, ' ') → Hapus semua tag HTML (<p>, </p>, <b>, dll) dan ganti jadi spasi.
    // 3. .replace(/\s+/g, ' ') → Gabungkan spasi/enter yang dobel-dobel jadi 1 spasi saja.
    // 4. .trim() → Buang spasi sisa di awal dan ujung kalimat.
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