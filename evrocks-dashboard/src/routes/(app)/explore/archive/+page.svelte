<script>
// ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';

    let {data} = $props();
    // const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // 1. (html ?? '') → Pengaman kalau html kosong (null/undefined), ganti jadi string kosong ''.
    // 2. .replace(/<[^>]*>/g, ' ') → Hapus semua tag HTML (<p>, </p>, <b>, dll) dan ganti jadi spasi.
    // 3. .replace(/\s+/g, ' ') → Gabungkan spasi/enter yang dobel-dobel jadi 1 spasi saja.
    // 4. .trim() → Buang spasi sisa di awal dan ujung kalimat.
</script>

<div class="max-w-6xl mx-auto w-full p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">Catalog Archives</h1>
            <p class="text-sm text-muted-foreground">Display {data.archives.length} published archives</p>
        </div>

        <form method="GET" class="flex items-center gap-2 w-full sm:w-auto">
            <Input name="q" value={data.q} placeholder="Search for a title or archive code..." class="sm:w-64 h-9" />
            <Button type="submit" size="sm" class="h-9">Searching</Button>
            {#if data.q}
                <Button href="/explore/archive" variant="ghost" size="sm" class="h-9">Reset</Button>         
            {/if}
        </form>
    </div>
</div>