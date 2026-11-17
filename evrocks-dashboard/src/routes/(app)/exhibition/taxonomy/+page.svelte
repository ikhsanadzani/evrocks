<script>
    // @ts-nocheck

    import TaxonomyManager from "#lib/components/taxonomy-manager.svelte";
    let { data, form } = $props();
</script>

<TaxonomyManager                                                                                                                                              
        tab="exhibition"                                                                                                                                          
        taxonomy_list={data.taxonomy_list}                                                                                                                        
        active_taxonomy={data.active_taxonomy}                                                                                                                    
        terms={data.terms}                                                                                                                                        
        terms_error={data.terms_error}                                                                                                                            
        {form}                                                                                                                                                    
    />                                                                                                                                                            
         