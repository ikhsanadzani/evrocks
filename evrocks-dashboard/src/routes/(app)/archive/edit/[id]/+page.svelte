<script>
    // @ts-nocheck
    import { enhance } from '$app/forms';
    import * as Card from "#lib/components/ui/card/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    import { Input } from "#lib/components/ui/input/index.ts";
    import { Label } from "#lib/components/ui/label/index.ts";
    import TaxonomySelector from "#lib/components/taxonomy-selector.svelte";
    import { TAXONOMIES } from "#lib/taxonomies.js";

    let { data, form } = $props();
    let archive = $derived(data.archive);
    let meta = $derived({ ...(archive.metabox ?? {}), ...(archive.meta ?? {}) });

    const select_class = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs";
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between border-b pb-4">
        <div>
            <h1 class="text-xl font-semibold">Edit Archive #{archive.id}</h1>
            <p class="text-xs text-muted-foreground">Slug: {archive.slug}</p>
        </div>
        <Button href="/archive" variant="outline" size="sm">Back</Button>
    </div>

    {#if form?.error}
        <div class="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
            {form.error}
        </div>
    {/if}

    <form method="POST" action="?/update_archive" enctype="multipart/form-data" use:enhance class="space-y-6">
        <input type="hidden" name="id" value={archive.id} />

        <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Informasi Dasar & Lampiran</Card.Title>
            </Card.Header>
            <Card.Content class="space-y-4 pt-4">
                <div class="grid w-full items-center gap-1.5">
                    <Label for="featured_image">Featured Image</Label>
                    {#if archive.featured_image_url}
                        <img
                            src={archive.featured_image_url}
                            alt="Preview"
                            class="h-32 w-auto rounded-md border object-cover"
                        />
                    {/if}
                    <Input id="featured_image" name="featured_image" type="file" accept="image/*" />
                </div>

                <div class="grid w-full items-center gap-1.5">
                    <Label for="attachment_file">File Digital / Dokumen</Label>
                    {#if archive.file_digital}
                        <a href={archive.file_digital} target="_blank" rel="noreferrer" class="text-xs underline text-primary hover:text-primary-hover">
                            Lihat File Aktif
                        </a>
                    {/if}
                    <Input id="attachment_file" name="attachment_file" type="file" accept=".pdf,.doc,.docx,.zip" />
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <div class="space-y-2">
                        <Label for="title">Title</Label>
                        <Input id="title" name="title" value={archive.raw_title} required />
                    </div>
                    <div class="space-y-2">
                        <Label for="status">Status</Label>
                        <select id="status" name="status" value={archive.status} class={select_class}>
                            <option value="publish">Publish</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending Review</option>
                        </select>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="content">Description / Content</Label>
                    <textarea
                        id="content"
                        name="content"
                        rows="5"
                        class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
                    >{archive.raw_content}</textarea>
                </div>
            </Card.Content>
        </Card.Root>

        <TaxonomySelector
            taxonomy_list={TAXONOMIES.archive}
            terms_by_tax={data.taxonomy_terms ?? {}}
            selected_taxonomies={archive.taxonomies ?? {}}
        />

        <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Identity & Provenance (Metabox)</Card.Title>
            </Card.Header>
            <Card.Content class="grid gap-4 md:grid-cols-2 pt-4">
                <div class="space-y-2">
                    <Label for="meta_code">Reference Code</Label>
                    <Input id="meta_code" name="meta_code" value={meta.code ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_classification">Primary Domain</Label>
                    <select id="meta_classification" name="meta_classification" value={meta.classification ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="hr">Human Resources</option>
                        <option value="finance">Finance</option>
                        <option value="it">Information Technology</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_classification_code">Classification Code</Label>
                    <Input id="meta_classification_code" name="meta_classification_code" value={meta.classification_code ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_file_number">File / Item Number</Label>
                    <Input id="meta_file_number" name="meta_file_number" type="number" min="1" value={meta.file_number ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_date">Document Date</Label>
                    <Input id="meta_date" name="meta_date" type="date" value={meta.date ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_archive_year">Archive Year</Label>
                    <Input id="meta_archive_year" name="meta_archive_year" value={meta.archive_year ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_processing_unit">Processing Unit</Label>
                    <Input id="meta_processing_unit" name="meta_processing_unit" value={meta.processing_unit ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_volume">Volume & Extent</Label>
                    <Input id="meta_volume" name="meta_volume" value={meta.volume ?? ''} />
                </div>
            </Card.Content>
        </Card.Root>

        <Card.Root class="bg-gradient-to-t from-primary/5 to-card shadow-xs">
            <Card.Header class="border-b pb-3">
                <Card.Title class="text-base">Physical Status, Retention & Dublin Core (Metabox)</Card.Title>
            </Card.Header>
            <Card.Content class="grid gap-4 md:grid-cols-2 pt-4">
                <div class="space-y-2">
                    <Label for="meta_authenticity">Authenticity</Label>
                    <select id="meta_authenticity" name="meta_authenticity" value={meta.authenticity ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="authentic">Authentic (Verified)</option>
                        <option value="unauthenticated">Unauthenticated (Pending Verification)</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_development_status">Development Status</Label>
                    <select id="meta_development_status" name="meta_development_status" value={meta.development_status ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="original">Original</option>
                        <option value="copy">Copy</option>
                        <option value="cc">Carbon Copy (CC)</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_physical_condition">Physical Condition</Label>
                    <select id="meta_physical_condition" name="meta_physical_condition" value={meta.physical_condition ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="good">Good (Intact & Legible)</option>
                        <option value="partially_damaged">Partially Damaged (Minor Wear)</option>
                        <option value="damaged">Damaged (Requires Conservation)</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_storage_location">Storage Location</Label>
                    <Input id="meta_storage_location" name="meta_storage_location" value={meta.storage_location ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_access_status">Access Classification</Label>
                    <select id="meta_access_status" name="meta_access_status" value={meta.access_status ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="open">Ordinary / Open (Public)</option>
                        <option value="restricted">Restricted (Internal Only)</option>
                        <option value="confidential">Confidential</option>
                        <option value="top_secret">Top Secret</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_active_retention">Active Retention Period (Years)</Label>
                    <Input id="meta_active_retention" name="meta_active_retention" type="number" min="0" value={meta.active_retention ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_inactive_retention">Inactive Retention Period (Years)</Label>
                    <Input id="meta_inactive_retention" name="meta_inactive_retention" type="number" min="0" value={meta.inactive_retention ?? ''} />
                </div>
                <div class="space-y-2">
                    <Label for="meta_follow_up">Final Disposition Action</Label>
                    <select id="meta_follow_up" name="meta_follow_up" value={meta.follow_up ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="permanent">Permanent (Historical Preservation)</option>
                        <option value="destroy">Destroy (Scheduled Destruction)</option>
                        <option value="review">Review (Re-evaluate)</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_exhibition_available">Virtual Exhibition Status</Label>
                    <select id="meta_exhibition_available" name="meta_exhibition_available" value={meta.exhibition_available ?? ''} class={select_class}>
                        <option value="">— Pilih —</option>
                        <option value="yes">Available for Virtual Exhibitions</option>
                        <option value="no">Excluded from Virtual Exhibitions</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <Label for="meta_dc_subject">Subject & Keywords (Dublin Core)</Label>
                    <Input id="meta_dc_subject" name="meta_dc_subject" value={meta.dc_subject ?? ''} />
                </div>
                <div class="space-y-2 md:col-span-2">
                    <Label for="meta_dc_contributor">Contributor (Dublin Core)</Label>
                    <Input id="meta_dc_contributor" name="meta_dc_contributor" value={meta.dc_contributor ?? ''} />
                </div>
            </Card.Content>
        </Card.Root>

        <div class="flex items-center gap-2 pt-2">
            <Button type="submit">Simpan Perubahan</Button>
            <Button href="/archive" variant="outline">Batal</Button>
        </div>
    </form>
</div>
