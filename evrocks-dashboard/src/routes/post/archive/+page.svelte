<script>
    // Tangkap data yang dilempar dari +page.server.js
    let { data } = $props();
</script>

<div class="p-8">
    <h1 class="text-2xl font-bold mb-4 text-red-500">HASIL TEST API WORDPRESS:</h1>
    
    <!-- Render seluruh data arsip jadi teks JSON murni biar kelihatan isinya -->
    <pre >
        {JSON.stringify(data.archives, null, 2)}
    </pre>
</div>