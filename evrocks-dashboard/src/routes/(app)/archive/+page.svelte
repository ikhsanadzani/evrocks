    <script>                                                                  
        // @ts-nocheck                                                        
        import PostList from "#lib/components/post-list.svelte";              
        let { data } = $props();                                              
    </script>                                                                 
                                                                              
    <PostList                                                                 
        title="Archive Repository"                                            
        subtitle="Koleksi dokumen dan rekaman arsip digital."                 
        unit="item"                                                           
        empty_text="Belum ada data archive."                                  
        base_url="/archive"                                                   
        items={data.archives ?? []}                                           
    />