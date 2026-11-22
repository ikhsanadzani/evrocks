<script>
    // @ts-nocheck

    import * as Card from "#lib/components/ui/card/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";

    let {
        title,
        subtitle = "",
        unit = "item",
        empty_text = "Gaada data",
        base_url,
        items = [],
        show_image = false
    } = $props();

    const strip_html = (html) => (html ?? "").replace(/<[^>]*>/g, "  ").replace(/\s+/g, " ").trim(); 
</script>

<div class="p-6 space-y-4">
    <div class="flex items-center justify between">
        <div>
            <h1 class="text-xl font-semibold">{title}</h1>
            {#if subtitle}
                <p class="text-xs text-muted-foreground">{subtitle}</p>
            {/if}
        </div>
        <span class="text-sm text-muted-foreground">Total: {items.length}{unit}</span>
    </div>

    <div>
        {#each items as item(item.id) }
            <Card.Root>
                <div>
                    {#if show_image && item.featured_image_url}
                        <img src={item.featured_image_url} alt={strip_html(item.title)}>
                    {/if}
                </div>
            </Card.Root>
        {/each}
    </div>
</div>