<script>
    // @ts-nocheck
    let { data } = $props();
</script>

<div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Archive Loans & Circulation</h1>
        <span class="text-sm text-muted-foreground">Total: {data.loans?.length ?? 0} permohonan</span>
    </div>

    <div class="border rounded-md overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground border-b">
                <tr>
                    <th class="p-3 font-medium w-16">ID</th>
                    <th class="p-3 font-medium">User ID</th>
                    <th class="p-3 font-medium">Loan Purpose</th>
                    <th class="p-3 font-medium">Requested Archives</th>
                    <th class="p-3 font-medium">Duration / Exp</th>
                    <th class="p-3 font-medium">Status</th>
                    <th class="p-3 font-medium">Remarks</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                {#each data.loans ?? [] as item (item.id)}
                    <tr class="hover:bg-muted/50">
                        <td class="p-3 font-mono text-xs">#{item.id}</td>
                        <td class="p-3">User #{item.user_id}</td>
                        <td class="p-3 font-medium">{item.purpose}</td>
                        <td class="p-3 text-muted-foreground whitespace-pre-line">{item.title}</td>
                        <td class="p-3 text-xs text-muted-foreground">{item.duration}</td>
                        <td class="p-3">
                            <span class="px-2 py-0.5 text-xs rounded border uppercase font-medium">
                                {item.status}
                            </span>
                        </td>
                        <td class="p-3 text-muted-foreground">{item.reason}</td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="7" class="p-6 text-center text-muted-foreground">
                            Belum ada permohonan peminjaman arsip.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>