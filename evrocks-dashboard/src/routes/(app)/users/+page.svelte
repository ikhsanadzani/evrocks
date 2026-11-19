    <script>                                                                                                                                                      
        // @ts-nocheck                                                                                                                                            
        import { enhance } from '$app/forms';                                                                                                                     
        import { Button } from '#lib/components/ui/button/index.ts';                                                                                              
        import { Input } from '#lib/components/ui/input/index.ts';                                                                                                
        import { Label } from '#lib/components/ui/label/index.ts';                                                                                                
                                                                                                                                                                  
        let { data, form } = $props();                                                                                                                            
                                                                                                                                                                  
        const ROLES = [                                                                                                                                           
            { value: 'administrator', label: 'Administrator' },                                                                                                   
            { value: 'editor', label: 'Arsiparis' },                                                                                                              
            { value: 'subscriber', label: 'User' }                                                                                                                
        ];                                                                                                                                                        
    </script>                                                                                                                                                     
                                                                                                                                                                  
    <div class="p-6 space-y-6">                                                                                                                                   
        <div class="flex items-center justify-between">                                                                                                           
            <div>                                                                                                                                                 
                <h1 class="text-xl font-semibold">User Management</h1>                                                                                            
                <p class="text-sm text-muted-foreground">Kelola akun dan hierarki role WordPress.</p>                                                             
            </div>                                                                                                                                                
            <span class="text-sm text-muted-foreground">Total: {data.users?.length ?? 0} user</span>                                                              
        </div>                                                                                                                                                    
                                                                                                                                                                  
        {#if data.users_error || form?.error}                                                                                                                     
            <div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">                                                  
                {data.users_error || form?.error}                                                                                                                 
            </div>                                                                                                                                                
        {/if}                                                                                                                                                     
                                                                                                                                                                  
        <form method="POST" action="?/create_user" use:enhance class="border rounded-md p-4 space-y-3 bg-muted/20">                                               
            <h2 class="text-sm font-medium">Tambah User Baru</h2>                                                                                                 
            <div class="grid gap-3 md:grid-cols-5">                                                                                                               
                <div class="space-y-1">                                                                                                                           
                    <Label for="new-username" class="text-xs">Username</Label>                                                                                    
                    <Input id="new-username" name="username" required class="h-8 text-sm" />                                                                      
                </div>                                                                                                                                            
                <div class="space-y-1">                                                                                                                           
                    <Label for="new-name" class="text-xs">Nama</Label>                                                                                            
                    <Input id="new-name" name="name" class="h-8 text-sm" />                                                                                       
                </div>                                                                                                                                            
                <div class="space-y-1">                                                                                                                           
                    <Label for="new-email" class="text-xs">Email</Label>                                                                                          
                    <Input id="new-email" name="email" type="email" required class="h-8 text-sm" />                                                               
                </div>                                                                                                                                            
                <div class="space-y-1">                                                                                                                           
                    <Label for="new-password" class="text-xs">Password</Label>                                                                                    
                    <Input id="new-password" name="password" type="password" required class="h-8 text-sm" />                                                      
                </div>                                                                                                                                            
                <div class="space-y-1">                                                                                                                           
                    <Label for="new-role" class="text-xs">Role</Label>                                                                                            
                    <div class="flex gap-2">                                                                                                                      
                        <select id="new-role" name="role" class="h-8 w-full rounded-md border bg-background px-2 text-sm">                                        
                            {#each ROLES as r (r.value)}                                                                                                          
                                <option value={r.value}>{r.label}</option>                                                                                        
                            {/each}                                                                                                                               
                        </select>                                                                                                                                 
                        <Button type="submit" size="sm" class="h-8">Tambah</Button>                                                                               
                    </div>                                                                                                                                        
                </div>                                                                                                                                            
            </div>                                                                                                                                                
        </form>                                                                                                                                                   
                                                                                                                                                                  
        <div class="border rounded-md overflow-x-auto">                                                                                                           
            <table class="w-full text-sm text-left">                                                                                                              
                <thead class="bg-muted text-muted-foreground border-b">                                                                                           
                    <tr>                                                                                                                                          
                        <th class="p-3 font-medium w-16">ID</th>                                                                                                  
                        <th class="p-3 font-medium">Nama / Username</th>                                                                                          
                        <th class="p-3 font-medium">Email</th>                                                                                                    
                        <th class="p-3 font-medium">Role</th>                                                                                                     
                        <th class="p-3 font-medium text-right">Aksi</th>                                                                                          
                    </tr>                                                                                                                                         
                </thead>                                                                                                                                          
                <tbody class="divide-y">                                                                                                                          
                    {#each data.users ?? [] as u (u.id)}                                                                                                          
                        <tr class="hover:bg-muted/50">                                                                                                            
                            <td class="p-3 font-mono text-xs">#{u.id}</td>                                                                                        
                            <td class="p-3">                                                                                                                      
                                <div class="font-medium">{u.name || u.username}</div>                                                                             
                                <div class="text-xs text-muted-foreground">@{u.username}</div>                                                                    
                            </td>                                                                                                                                 
                            <td class="p-3 text-muted-foreground">{u.email || '-'}</td>                                                                           
                            <td class="p-3">                                                                                                                      
                                <form method="POST" action="?/update_role" use:enhance class="flex items-center gap-2">                                           
                                    <input type="hidden" name="id" value={u.id} />                                                                                
                                    <select name="role" value={u.role} class="h-8 rounded-md border bg-background px-2 text-xs">                                  
                                        {#each ROLES as r (r.value)}                                                                                              
                                            <option value={r.value}>{r.label}</option>                                                                            
                                        {/each}                                                                                                                   
                                    </select>                                                                                                                     
                                    <Button type="submit" variant="outline" size="sm" class="h-8 text-xs">Simpan</Button>                                         
                                </form>                                                                                                                           
                            </td>                                                                                                                                 
                            <td class="p-3 text-right">                                                                                                           
                                <form method="POST" action="?/delete_user" use:enhance class="inline">                                                            
                                    <input type="hidden" name="id" value={u.id} />                                                                                
                                    <Button                                                                                                                       
                                        type="submit"                                                                                                             
                                        variant="ghost"                                                                                                           
                                        size="sm"                                                                                                                 
                                        class="text-destructive h-8 text-xs"                                                                                      
                                        disabled={u.id === data.user?.id}                                                                                         
                                    >                                                                                                                             
                                        Hapus                                                                                                                     
                                    </Button>                                                                                                                     
                                </form>                                                                                                                           
                            </td>                                                                                                                                 
                        </tr>                                                                                                                                     
                    {:else}                                                                                                                                       
                        <tr>                                                                                                                                      
                            <td colspan="5" class="p-6 text-center text-muted-foreground">Belum ada data user.</td>                                               
                        </tr>                                                                                                                                     
                    {/each}                                                                                                                                       
                </tbody>                                                                                                                                          
            </table>                                                                                                                                              
        </div>                                                                                                                                                    
    </div>     