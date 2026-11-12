<script>
    let { data } = $props();
</script>

<div class="p-8">
    <h1>HASIL TEST FACTORY API</h1>
    
    <pre >
        {JSON.stringify(data.exhibitions, null, 2)}
    </pre>
</div>