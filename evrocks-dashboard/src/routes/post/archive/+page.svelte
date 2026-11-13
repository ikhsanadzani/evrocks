<script>
    // @ts-nocheck
    import { Button } from "#lib/components/ui/button/index.ts";
    let { data } = $props();
</script>

<div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Archive Repository</h1>
        <span class="text-sm text-muted-foreground">Total: {data.archives?.length ?? 0} item</span>
    </div>

    <div class="border rounded-md overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground border-b">
                <tr>
                    <th class="p-3 font-medium w-16">ID</th>
                    <th class="p-3 font-medium">Title</th>
                    <th class="p-3 font-medium">Slug</th>
                    <th class="p-3 font-medium">Status</th>
                    <th class="p-3 font-medium">Date</th>
                    <th class="p-3 font-medium text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                {#each data.archives ?? [] as item (item.id)}
                    <tr class="hover:bg-muted/50">
                        <td class="p-3 font-mono text-xs">#{item.id}</td>
                        <td class="p-3 font-medium">{@html item.title}</td>
                        <td class="p-3 text-muted-foreground">{item.slug}</td>
                        <td class="p-3">
                            <span class="badge-status">{item.status}</span>
                        </td>
                        <td class="p-3 text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('id-ID')}
                        </td>

                        <td class="p-3 text-right">
                            <Button href="/?tab=archive&view=edit&id={item.id}" variant="outline" size="sm">
                                Edit
                            </Button>
                        </td>

                        <td class="p-3 text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('id-ID')}
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="6" class="p-6 text-center text-muted-foreground">
                            Belum ada data archive.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>