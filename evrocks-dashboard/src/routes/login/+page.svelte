<script>                                                                                                                                                      
    // @ts-nocheck                                                                                                                                            
    import { enhance } from '$app/forms';                                                                                                                     
    import { Button } from '#lib/components/ui/button/index.ts';                                                                                              
    import { Input } from '#lib/components/ui/input/index.ts';                                                                                                
    import { Label } from '#lib/components/ui/label/index.ts';                                                                                                
    import logo from '#lib/assets/logo.png';                                                                                                                  
                                                                                                                                                                
    let { form } = $props();                                                                                                                                  
</script>                                                                                                                                                     
                                                                                                                                                                
<div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">                                                                                   
    <div class="w-full max-w-sm border bg-background rounded-lg p-6 space-y-6 shadow-sm">                                                                     
        <div class="flex items-center gap-2">                                                                                                                 
            <img src={logo} alt="Evrocks" class="size-6" />                                                                                                   
            <h1 class="text-lg font-semibold">Evrocks Dashboard</h1>                                                                                          
        </div>                                                                                                                                                
                                                                                                                                                                
        {#if form?.error}                                                                                                                                     
            <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">                                              
                {form.error}                                                                                                                                  
            </div>                                                                                                                                            
        {/if}                                                                                                                                                 
                                                                                                                                                                
        <form method="POST" action="?/login" use:enhance class="space-y-4">                                                                                                    
            <div class="space-y-1.5">                                                                                                                         
                <Label for="username">Username</Label>                                                                                                        
                <Input id="username" name="username" required autocomplete="username" />                                                                      
            </div>                                                                                                                                            
            <div class="space-y-1.5">                                                                                                                         
                <Label for="password">Password</Label>                                                                                                        
                <Input id="password" name="password" type="password" required autocomplete="current-password" />                                              
            </div>                                                                                                                                            
            <Button type="submit" class="w-full">Login</Button>                                                                                               
        </form>                                                                                                                                               
    </div>                                                                                                                                                    
</div>       