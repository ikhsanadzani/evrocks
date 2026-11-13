<script>
    // @ts-nocheck
    import { enhance } from '$app/forms';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';
    import { Label } from '#lib/components/ui/label/index.ts';

    let { data, form } = $props();
</script>

<div class="max-w-2xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between border-b pb-4">
        <div>
            <h1 class="text-xl font-semibold">Edit Exhibition #{data.exhibition.id}</h1>
            <p class="text-xs text-muted-foreground">Slug: #{data.exhibition.slug}</p>
        </div>
        <Button href="/?tab=exhibition" variant="outline" size="sm">Back</Button>
    </div>

    {#if form?.error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {form.error}
        </div>
    {/if}

    <form method="POST" action="?/update_exhibition" enctype="multipart/form-data" use:enhance class="space-y-4">
        <input type="hidden" name="id" value={data.exhibition.id} />

        <div class="grid w-full items-center gap-1.5">
            <Label for="featured_image">Featured Image / Poster Pameran</Label>
            {#if data.exhibition.featured_image_url}
                <img
                    src={data.exhibition.featured_image_url}
                    alt="Preview"
                    class="h-40 w-auto rounded-md border object-cover"
                />
            {/if}
            <Input id="featured_image" name="featured_image" type="file" accept="image/*" />
        </div>

        <div class="grid w-full items-center gap-1.5">
            <Label for="attachment_file">File Digital / Katalog Pameran</Label>
            {#if data.exhibition.file_digital}
                <a href={data.exhibition.file_digital} target="_blank" rel="noreferrer" class="text-xs underline text-primary">
                    Lihat File Aktif
                </a>
            {/if}
            <Input id="attachment_file" name="attachment_file" type="file" accept=".pdf,.doc,.docx,.zip" />
        </div>

        <div class="space-y-2">
            <Label for="title">Title</Label>
            <Input id="title" name="title" value={data.exhibition.raw_title} required />
        </div>

        <div class="space-y-2">
            <Label for="status">Status</Label>
            <select
                id="status"
                name="status"
                value={data.exhibition.status}
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
                <option value="publish">Publish</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
            </select>
        </div>

        <div class="space-y-2">
            <Label for="content">Curatorial Narrative / Content</Label>
            <textarea
                id="content"
                name="content"
                rows="6"
                class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
            >{data.exhibition.raw_content}</textarea>
        </div>

        <div class="flex items-center gap-2 pt-2">
            <Button type="submit">Simpan Perubahan</Button>
            <Button href="/?tab=exhibition" variant="outline">Batal</Button>
        </div>
    </form>
</div>