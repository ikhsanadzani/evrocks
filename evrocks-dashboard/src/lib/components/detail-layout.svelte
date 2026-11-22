<script>
    // @ts-nocheck
    let { back_href, back_label, id, title, badges, actions, main, aside } = $props();
</script>

<div class="max-w-6xl mx-auto w-full p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5">
        <div class="space-y-2 min-w-0">
            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <a href={back_href} class="hover:underline">{back_label}</a>
                <span>/</span>
                <span class="font-mono">#{id}</span>
            </div>
            <h1 class="text-2xl font-semibold tracking-tight leading-snug">{@html title}</h1>
            {#if badges}
                <div class="flex flex-wrap items-center gap-2 pt-0.5">
                    {@render badges()}
                </div>
            {/if}
        </div>

        {#if actions}
            <div class="flex items-center gap-2 shrink-0">
                {@render actions()}
            </div>
        {/if}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div class="lg:col-span-2 space-y-6">
            {@render main()}
        </div>
        <div class="space-y-6 lg:sticky lg:top-6">
            {@render aside()}
        </div>
    </div>
</div>
