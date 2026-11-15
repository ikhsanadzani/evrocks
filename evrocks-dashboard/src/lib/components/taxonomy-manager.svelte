<script>
    // @ts-nocheck
    import { enhance } from '$app/forms';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';
    import { Label } from '#lib/components/ui/label/index.ts';

    // tab: 'archive' | 'exhibition'
    let { tab, taxonomy_list = [], active_taxonomy, terms = [], terms_error = null, form } = $props();

    const term_name = (id) => terms.find((t) => t.id === id)?.name ?? '-';
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="border-b pb-4">
        <h1 class="text-xl font-semibold capitalize">{tab} Taxonomy</h1>
        <p class="text-xs text-muted-foreground">Kelola term untuk setiap taxonomy {tab}.</p>
    </div>

    <div class="flex flex-wrap gap-2">
        {#each taxonomy_list as t (t.key)}
            <Button
                href="/?tab={tab}&view=taxonomy&tax={t.key}"
                size="sm"
                variant={t.key === active_taxonomy?.key ? 'default' : 'outline'}
            >
                {t.label}
            </Button>
        {/each}
    </div>

    {#if !active_taxonomy}
        <div class="p-6 border rounded-md text-center text-muted-foreground">
            Belum ada taxonomy untuk {tab}.
        </div>
    {:else}
        {#if terms_error}
            <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                Gagal memuat term: {terms_error}
            </div>
        {/if}
        {#if form?.taxonomy_error}
            <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {form.taxonomy_error}
            </div>
        {/if}

        <form method="POST" action="?/create_term" use:enhance class="space-y-4 rounded-lg border bg-card p-6">
            <h2 class="font-semibold">Tambah {active_taxonomy.label}</h2>
            <input type="hidden" name="tab" value={tab} />
            <input type="hidden" name="tax" value={active_taxonomy.key} />

            <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                    <Label for="term_name">Name</Label>
                    <Input id="term_name" name="name" required />
                </div>
                <div class="space-y-2">
                    <Label for="term_slug">Slug (opsional)</Label>
                    <Input id="term_slug" name="slug" />
                </div>
            </div>

            {#if active_taxonomy.hierarchical}
                <div class="space-y-2">
                    <Label for="term_parent">Parent (opsional)</Label>
                    <select
                        id="term_parent"
                        name="parent"
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="0">— Tidak ada —</option>
                        {#each terms as t (t.id)}
                            <option value={t.id}>{t.name}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            <div class="space-y-2">
                <Label for="term_description">Description (opsional)</Label>
                <textarea
                    id="term_description"
                    name="description"
                    rows="2"
                    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                ></textarea>
            </div>

            <Button type="submit">Tambah Term</Button>
        </form>

        <div class="border rounded-md overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="bg-muted text-muted-foreground border-b">
                    <tr>
                        <th class="p-3 font-medium w-16">ID</th>
                        <th class="p-3 font-medium">Name</th>
                        <th class="p-3 font-medium">Slug</th>
                        {#if active_taxonomy.hierarchical}
                            <th class="p-3 font-medium">Parent</th>
                        {/if}
                        <th class="p-3 font-medium w-20">Count</th>
                        <th class="p-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    {#each terms as term (term.id)}
                        <tr class="hover:bg-muted/50">
                            <td class="p-3 font-mono text-xs">#{term.id}</td>
                            <td class="p-3 font-medium">{term.name}</td>
                            <td class="p-3 text-muted-foreground">{term.slug}</td>
                            {#if active_taxonomy.hierarchical}
                                <td class="p-3 text-muted-foreground">
                                    {term.parent ? term_name(term.parent) : '-'}
                                </td>
                            {/if}
                            <td class="p-3">{term.count}</td>
                            <td class="p-3 text-right">
                                <form
                                    method="POST"
                                    action="?/delete_term"
                                    use:enhance={({ cancel }) => {
                                        if (!confirm(`Hapus term "${term.name}"?`)) cancel();
                                    }}
                                >
                                    <input type="hidden" name="tab" value={tab} />
                                    <input type="hidden" name="tax" value={active_taxonomy.key} />
                                    <input type="hidden" name="id" value={term.id} />
                                    <Button type="submit" variant="outline" size="sm">Delete</Button>
                                </form>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="6" class="p-6 text-center text-muted-foreground">
                                Belum ada term di {active_taxonomy.label}.
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
