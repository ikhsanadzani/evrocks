<script>
    // @ts-nocheck
    import { page } from '$app/state';
    import { Button } from '#lib/components/ui/button/index.ts';
</script>

<div class="min-h-screen flex items-center justify-center bg-muted/30 p-6">
    <div class="w-full max-w-md border bg-background rounded-lg p-6 text-center space-y-4 shadow-sm">
        <div class="text-4xl font-bold font-mono text-muted-foreground">{page.status}</div>
        <h1 class="text-lg font-semibold">
            {#if page.status === 403}
                Akses Ditolak
            {:else if page.status === 404}
                Halaman Tidak Ditemukan
            {:else}
                Terjadi Kesalahan
            {/if}
        </h1>
        <p class="text-sm text-muted-foreground">
            {page.error?.message || 'Halaman yang kamu cari tidak tersedia.'}
        </p>
        <div class="pt-2">
            <Button href="/" size="sm">Kembali ke Dashboard</Button>
        </div>
    </div>
</div>
