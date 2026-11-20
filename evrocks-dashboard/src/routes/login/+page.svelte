<script>                                                                                                                                                      
    // @ts-nocheck                                                                                                                                            
    import { enhance } from '$app/forms';                                                                                                                     
    import { Button } from '#lib/components/ui/button/index.ts';                                                                                              
    import { Input } from '#lib/components/ui/input/index.ts';                                                                                                
    import { Label } from '#lib/components/ui/label/index.ts';                                                                                                
    import logo from '#lib/assets/logo.png';  
	import { Progress } from "#lib/components/ui/progress/index.ts";         


    let { form } = $props();
    let loading = $state(false);
    let progress = $state(0);

    function handle_login(){
        loading = true;
        progress = 25;

        const timer = setInterval(() => {
            if (progress < 90) progress += 15;
        }, 250);

        return async ({ update }) => {
            clearInterval(timer);
            progress = 100;
            await update();
            loading = false;        
        };
    }
    
</script>                                                                                                                                                     
                                                                                                                                                                
<div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">                                                                                   
    <div class="w-full max-w-sm border bg-background rounded-lg p-6 space-y-6 shadow-sm">                                                                     
        <div class="flex items-center gap-2">                                                                                                                 
            <img src={logo} alt="Evrocks" class="size-6" />                                                                                                   
            <h1 class="text-lg font-semibold">Evrocks Dashboard</h1>                                                                                          
        </div>
        
        {#if loading}
            <Progress value={ progress } max{100} class="h-1.5 w-full"></Progress>
        {/if}
                                                                                                                                                                
        {#if form?.error}                                                                                                                                     
            <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">                                              
                {form.error}                                                                                                                                  
            </div>                                                                                                                                            
        {/if}                                                                                                                                                 
                                                                                                                                                                
        <form method="POST" action="?/login" use:enhance={handle_login} class="space-y-4">                                                                                                    
            <div class="space-y-1.5">                                                                                                                         
                <Label for="username">Username</Label>                                                                                                        
                <Input id="username" name="username" required autocomplete="username" disabled={loading} />                                                                      
            </div>                                                                                                                                            
            <div class="space-y-1.5">                                                                                                                         
                <Label for="password">Password</Label>                                                                                                        
                <Input id="password" name="password" type="password" required autocomplete="current-password" disabled={loading}/>                                              
            </div>                                                                                                                                            
            <Button type="submit" class="w-full" disabled={loading}>
                {loading ? 'Memproses...' : 'Login'}
            </Button>                                                                                               
        </form>                                                                                                                                               
    </div>                                                                                                                                                    
</div>       