<script>
    // @ts-nocheck
    import { enhance } from '$app/forms';
    import { Button } from '#lib/components/ui/button/index.ts';
    import { Input } from '#lib/components/ui/input/index.ts';
    let { data, form } = $props();
</script>

<div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">Archive Loans & Circulation</h1>
        <span class="text-sm text-muted-foreground">Total: {data.loans?.length ?? 0} permohonan</span>
    </div>

    {#if form?.error}
        <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {form.error}
        </div>
    {/if}

    <div class="border rounded-md overflow-x-auto">
        <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground border-b">
                <tr>
                    <th class="p-3 font-medium w-16">ID</th>
                    <th class="p-3 font-medium">Borrower</th>
                    <th class="p-3 font-medium">Loan Purpose</th>
                    <th class="p-3 font-medium">Requested Archives</th>
                    <th class="p-3 font-medium">Duration / Exp</th>
                    <th class="p-3 font-medium">Status</th>
                    <th class="p-3 font-medium">Remarks & Action</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                {#each data.loans ?? [] as item (item.id)}
                    <tr class="hover:bg-muted/50 align-top">
                        <td class="p-3 font-mono text-xs">#{item.id}</td>
                        <td class="p-3">
                            <div class="font-medium">{item.borrower ?? `User #${item.user_id}`}</div>
                            {#if item.email}
                                <div class="text-xs text-muted-foreground">{item.email}</div>
                            {/if}
                        </td>
                        <td class="p-3 font-medium">{item.purpose}</td>
                        <td class="p-3 text-muted-foreground whitespace-pre-line">{item.title}</td>
                        <td class="p-3 text-xs text-muted-foreground">{item.duration}</td>
                        <td class="p-3">
                            <span class="badge-status uppercase">{item.status}</span>
                        </td>
                        <td class="p-3 min-w-64">
                            <form method="POST" action="?/update_lender" use:enhance class="space-y-2">
                                <input type="hidden" name="id" value={item.id} />
                                <Input
                                    name="reason"
                                    value={item.reason === '-' ? '' : item.reason}
                                    placeholder="Catatan arsiparis..."
                                    class="h-8 text-xs"
                                />
                                <div class="flex flex-wrap gap-1.5">
                                    <Button type="submit" name="status" value="approve" size="sm">
                                        Approve
                                    </Button>
                                    <Button type="submit" name="status" value="decline" variant="outline" size="sm">
                                        Decline
                                    </Button>
                                    {#if item.status !== 'pending'}
                                        <Button type="submit" name="status" value="pending" variant="ghost" size="sm">
                                            Pending
                                        </Button>
                                    {/if}
                                </div>
                            </form>
                        </td>
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