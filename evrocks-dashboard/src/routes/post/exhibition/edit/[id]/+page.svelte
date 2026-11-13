<script>
    // @ts-nocheck
    import { enhance } from '$app/forms';
    import { Button } from '#lib/components/ui/button/index.ts';

    let { data, form } = $props();
</script>

<div class="p-6 max-w-2xl space-y-6">
    <div>
        <h1 class="text-xl font-semibold">Edit Exhibition #{data.exhibition.id}</h1>
        <p class="text-sm text-muted-foreground">Perbarui narasi dan status pameran virtual tanpa meninggalkan halaman.</p>
    </div>

    {#if form?.error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {form.error}
        </div>
    {/if}

    <form method="POST" action="?/update_exhibition" use:enhance class="space-y-4">
        <input type="hidden" name="id" value={data.exhibition.id} />

        <div class="space-y-1.5">
            <label for="title" class="text-sm font-medium">Title</label>
            <input id="title" name="title" type="text" value={data.exhibition.raw_title} required class="w-full px-3 py-2 text-sm border rounded-md bg-background"/>
        </div>

        <div class="space-y-1.5">
            <label for="content" class="text-sm font-medium">Curatorial Narrative / Content</label>
            <textarea id="content" name="content" rows="6" class="w-full px-3 py-2 text-sm border rounded-md bg-background" >
                {data.exhibition.raw_content}
            </textarea>
        </div>

        <div class="space-y-1.5">
            <label for="status" class="text-sm font-medium">Status</label>
            <select id="status" name="status" value={data.exhibition.status} class="w-full px-3 py-2 text-sm border rounded-md bg-background">
                <option value="publish">Publish</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
            </select>
        </div>

        <div class="flex items-center gap-2 pt-2">
            <Button type="submit">Simpan Perubahan</Button>
            <Button href="/?tab=exhibition" variant="outline">Batal</Button>
        </div>
    </form>
</div>