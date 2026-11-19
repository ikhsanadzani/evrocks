    <script>
        // @ts-nocheck                                                                                           
        import * as Card from '#lib/components/ui/card/index.js';
        import { Badge } from '#lib/components/ui/badge/index.js';
        import { Button } from '#lib/components/ui/button/index.ts';
  
        let { data } = $props();
        let exhibition = $derived(data.exhibition);
        let themes = $derived(exhibition.taxonomies?.exhibition_theme ?? []);
        const strip_html = (html) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();          
    </script>
  
    <div class="max-w-5xl mx-auto w-full p-6 space-y-8">
        <div>
            <Button href="/explore/exhibition" variant="ghost" size="sm">← Kembali ke Pameran Virtual</Button>   
        </div>
  
  	<!-- Header & Banner Hero -->
        <div class="space-y-4">
            {#if themes.length > 0}
                <div class="flex flex-wrap gap-1.5">
                    {#each themes as term (term.id)}
                        <Badge variant="secondary">{term.name}</Badge>
                    {/each}
                </div>
	    {/if} 
  
            <h1 class="text-3xl font-semibold tracking-tight">{@html exhibition.title}</h1>
            <p class="text-xs text-muted-foreground">
                Dipublikasikan {new Date(exhibition.date).toLocaleDateString('id-ID')}
	    </p> 
  
            {#if exhibition.featured_image_url}
                <div class="overflow-hidden rounded-lg border bg-muted">
                    <img
  			src={exhibition.featured_image_url} 
  			alt={strip_html(exhibition.title)}
    			class="w-full max-h-[480px] object-cover"
		    />
		</div>
            {/if} 
  
            <div class="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground/90 pt-2">
                {@html exhibition.content || '<p class="text-muted-foreground">Tidak ada narasi pameran.</p>'}
            </div>
        </div>
  
  	<!-- Daftar Arsip dalam Pameran --> 
	<div class="space-y-4 border-t pt-6">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Arsip dalam Pameran</h2>
		<span class="text-sm text-muted-foreground">{data.related_archives.length} arsip</span>
            </div>
  
  	    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each data.related_archives as arc (arc.id)}
                    <a href="/explore/archive/{arc.id}" class="group block">                                     
                        <Card.Root class="h-full overflow-hidden pt-0 transition-shadow group-hover:shadow-md">  
                            <div class="aspect-video w-full bg-muted overflow-hidden border-b">                  
                                {#if arc.featured_image_url}                                                     
                                    <img                                                                         
                                        src={arc.featured_image_url}                                             
                                        alt={strip_html(arc.title)}                                              
                                        class="w-full h-full object-cover transition-transform duration-300      
                                        group-hover:scale-105"                                                   
                                    />                                                                           
                                {:else}                                                                          
                                    <div class="w-full h-full flex items-center justify-center text-xs           
                                    text-muted-foreground">                                                      
                                        Tanpa Pratinjau                                                          
                                    </div>                                                                       
                                {/if}                                                                            
                            </div>                                                                               
                            <Card.Header class="pt-3">                                                           
                                <Card.Title class="text-sm leading-snug group-hover:underline">                  
                                    {@html arc.title}                                                            
                                </Card.Title>                                                                    
                            </Card.Header>                                                                       
                        </Card.Root>                                                                             
                    </a>                                                                                         
                {:else}                                                                                          
                    <div class="col-span-full p-6 border rounded-md text-center text-sm text-muted-foreground">  
                        Belum ada arsip yang ditautkan ke pameran ini.                                           
                    </div>
                {/each}
            </div>
        </div>
    </div>