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

                    <Card.Header>
                        <div>
                            <span class="font-mono">#{item.id}</span>
                            <span>{new Date(item.date).toLocaleDateString("id-ID")}</span>
                        </div>

                        <Card.Title>
                            <a href="{base_url}/detail/{item.id}">{@html item.title}</a>
                        </Card.Title>
                    </Card.Header>

                    <Card.Content>
                            <p>
                                {strip_html(item.content) || "gaada"}
                            </p>
                    </Card.Content>
                </div>

                <Card.Footer>
                    <span>{item.status}</span>
                    <div>
                        <Button href="{base_url}/detail/{item.id}">
                            View
                        </Button>

                        <Button hre="{base_url}/edit/{item.id}">
                            Edit
                        </Button>
                    </div>
                </Card.Footer>
            </Card.Root>
            {:else}
                <div>
                    {empty_text}
                </div>
        {/each}
    </div>
</div>