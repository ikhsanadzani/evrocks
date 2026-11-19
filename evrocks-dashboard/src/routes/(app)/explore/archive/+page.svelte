<script>
// @ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';
    import { Badge } from '#lib/components/ui/badge/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';
    let {data} = $props();

    const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    // 1. (html ?? '') → Pengaman kalau html kosong (null/undefined), ganti jadi string kosong ''.
    // 2. .replace(/<[^>]*>/g, ' ') → Hapus semua tag HTML (<p>, </p>, <b>, dll) dan ganti jadi spasi.
    // 3. .replace(/\s+/g, ' ') → Gabungkan spasi/enter yang dobel-dobel jadi 1 spasi saja.
    // 4. .trim() → Buang spasi sisa di awal dan ujung kalimat.
</script>

  <div>
            <h1 class="text-2xl font-semibold tracking-tight">Catalog Archives</h1>
            <p class="text-sm text-muted-foreground">Display {data.archives.length} published archives</p>
      <div class="max-w-6xl mx-auto w-full p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
        </div>

        <form method="GET" class="flex items-center gap-2 w-full sm:w-auto">
            <Input name="q" value={data.q} placeholder="Search for a title or archive code..." class="sm:w-64 h-9" />
            <Button type="submit" size="sm" class="h-9">Searching</Button>
            {#if data.q}
                <Button href="/explore/archive" variant="ghost" size="sm" class="h-9">Reset</Button>         
            {/if}
        </form>
    </div>

    {#if data.error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"> 
            Failed to load the archive catalog: {data.error}
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols2 lg:grid-cols3 gap-5">
        {#each data.archives as item (item.id) }
            <a href="/explore/archive/{item.id}" class="group block">
                <Card.Root class="h-full flex flex-col overflow-hidden pt-0 transition-shadow group-hover:shadow-md">
                    <div class="aspect-video w-full bg-muted overflow-hidden border-b">
                        {#if item.featured_image_url}
                            <img 
                            src={item.featured_image_url} 
                            alt={strip_html(item.title)}
                            class="w-full h-full object-cover transition-transform dration-300 group-hover:scale-150"
                            />
                            {:else}
                                <div class="w-ful h-full object-cover item-center justify-center text-xs text-muted-foreground">
                                    No Preview
                                </div>
                        {/if}
                    </div>

                    <Card.Header class="space-y-1.5 pt-4">
                        <div class="flex item-center gap-2 flex-wrap">
                            {#if item.metabox?.code}                                                         
                                    <Badge variant="outline" class="font-mono                                    
                                    text-[11px]">{item.metabox.code}</Badge>                                     
                                {/if}                                                                            
                                {#if item.metabox?.archive_year}                                                 
                                    <Badge variant="secondary"                                                   
                                    class="text-[11px]">{item.metabox.archive_year}</Badge>                      
                                {/if}  
                        </div>
                        <Card.Title class="text-base leading-snug group-hover:underline">                    
                                {@html item.title}                                                               
                        </Card.Title>
                    </Card.Header>

                </Card.Root>
            </a>
            {:else}
                <div class="col-span-full p-10">
                    No matching records were found.
                </div>
        {/each}
    </div>
</div>