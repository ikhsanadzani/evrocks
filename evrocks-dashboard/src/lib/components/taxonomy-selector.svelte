<script>
    // @ts-nocheck
    import * as Card from '#lib/components/ui/card/index.js';

    let { taxonomy_list = [], terms_by_tax = {}, selected_taxonomies = {} } = $props();

    const is_selected = (tax_key, term_id) =>
        (selected_taxonomies?.[tax_key] ?? []).some((t) => Number(t.id) === Number(term_id));
</script>

<Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
    <Card.Header class="border-b pb-3">
        <Card.Title class="text-base">Taxonomy</Card.Title>
        <Card.Description>Pilih term taxonomy yang sesuai.</Card.Description>
    </Card.Header>
    <Card.Content class="pt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each taxonomy_list as tax (tax.key)}
                {@const available_terms = terms_by_tax?.[tax.key] ?? []}
                <div class="rounded-md border bg-muted/20 p-3 space-y-2">
                    <div class="text-xs font-semibold text-foreground">{tax.label}</div>
                    {#if available_terms.length > 0}
                        <div class="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                            {#each available_terms as term (term.id)}
                                <label class="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="tax_{tax.key}"
                                        value={term.id}
                                        checked={is_selected(tax.key, term.id)}
                                        class="rounded border-input accent-primary"
                                    />
                                    <span>{term.name}</span>
                                </label>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-xs text-muted-foreground">Belum ada term.</p>
                    {/if}
                </div>
            {/each}
        </div>
    </Card.Content>
</Card.Root>
