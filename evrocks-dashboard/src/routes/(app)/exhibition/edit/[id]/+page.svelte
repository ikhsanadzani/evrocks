<script>
    // @ts-nocheck
    import { enhance } from '$app/forms';
    import * as Card from '#lib/components/ui/card/index.js';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';
    import { Label } from '#lib/components/ui/label/index.ts';
    import TaxonomySelector from '#lib/components/taxonomy-selector.svelte';
    import { TAXONOMIES } from '#lib/taxonomies.js';

    let { data, form } = $props();
    let exhibition = $derived(data.exhibition);
    let meta = $derived({ ...(exhibition.metabox ?? {}), ...(exhibition.meta ?? {}) });
    let selected_archives = $derived(
        Array.isArray(meta._daftar_arsip_pameran) ? meta._daftar_arsip_pameran.map(Number) : []
    );
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between border-b pb-4">
        <div>
            <h1 class="text-xl font-semibold">Edit Exhibition #{exhibition.id}</h1>
            <p class="text-xs text-muted-foreground">Slug: {exhibition.slug}</p>
        </div>
        <Button href="/exhibition" variant="outline" size="sm">Back</Button>
    </div>

    {#if form?.error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {form.error}
        </div>
    {/if}

    <form method="POST" action="?/update_exhibition" enctype="multipart/form-data" use:enhance class="space-y-6">
        <input type="hidden" name="id" value={exhibition.id} />

        <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Informasi Dasar & Lampiran</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-4 pt-4">
                <div class="grid w-full items-center gap-1.5">
                    <Label for="featured_image">Featured Image / Poster Pameran</Label>
                    {#if exhibition.featured_image_url}
                        <img
                            src={exhibition.featured_image_url}
                            alt="Preview"
                            class="h-40 w-auto rounded-md border object-cover"
                        />
                    {/if}
                    <Input id="featured_image" name="featured_image" type="file" accept="image/*" />
                </div>

                <div class="grid w-full items-center gap-1.5">
                    <Label for="attachment_file">File Digital / Katalog Pameran</Label>
                    {#if exhibition.file_digital}
                        <a href={exhibition.file_digital} target="_blank" rel="noreferrer" class="text-xs underline text-primary hover:text-primary-hover">
                            Lihat File Aktif
                        </a>
                    {/if}
                    <Input id="attachment_file" name="attachment_file" type="file" accept=".pdf,.doc,.docx,.zip" />
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-2">
                        <Label for="title">Title</Label>
                        <Input id="title" name="title" value={exhibition.raw_title} required />
                    </div>
                    <div class="space-y-2">
                        <Label for="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            value={exhibition.status}
                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                        >
                            <option value="publish">Publish</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="content">Curatorial Narrative / Content</Label>
                    <textarea
                        id="content"
                        name="content"
                        rows="5"
                        class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                    >{exhibition.raw_content}</textarea>
                </div>
            </Card.Content>
        </Card.Root>

        <TaxonomySelector
            taxonomy_list={TAXONOMIES.exhibition}
            terms_by_tax={data.taxonomy_terms ?? {}}
            selected_taxonomies={exhibition.taxonomies ?? {}}
        />

        <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Kuratorial & Jadwal Pameran (Metabox)</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-4 pt-4">
                <div class="grid gap-4 md:grid-cols-3">
                    <div class="space-y-2">
                        <Label for="meta_kurator_pameran">Kurator Pameran</Label>
                        <Input id="meta_kurator_pameran" name="meta__kurator_pameran" value={meta._kurator_pameran ?? ''} />
                    </div>
                    <div class="space-y-2">
                        <Label for="meta_tanggal_mulai">Tanggal Mulai</Label>
                        <Input id="meta_tanggal_mulai" name="meta__tanggal_mulai_pameran" type="date" value={meta._tanggal_mulai_pameran ?? ''} />
                    </div>
                    <div class="space-y-2">
                        <Label for="meta_tanggal_selesai">Tanggal Selesai</Label>
                        <Input id="meta_tanggal_selesai" name="meta__tanggal_selesai_pameran" type="date" value={meta._tanggal_selesai_pameran ?? ''} />
                    </div>
                </div>

                <div class="space-y-2">
                    <Label>Daftar Arsip Pameran</Label>
                    <div class="max-h-48 overflow-y-auto rounded-md border bg-muted/20 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {#each data.archives ?? [] as arc (arc.id)}
                            <label class="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="meta__daftar_arsip_pameran[]"
                                    value={arc.id}
                                    checked={selected_archives.includes(Number(arc.id))}
                                    class="rounded border-input accent-primary"
                                />
                                <span class="truncate">#{arc.id} — {@html arc.title}</span>
                            </label>
                        {:else}
                            <span class="text-xs text-muted-foreground">Belum ada arsip tersedia.</span>
                        {/each}
                    </div>
                </div>
            </Card.Content>
        </Card.Root>

        <div class="flex items-center gap-2 pt-2">
            <Button type="submit">Simpan Perubahan</Button>
            <Button href="/exhibition" variant="outline">Batal</Button>
        </div>
    </form>
</div>
