<script>                                                                                                     
	// @ts-nocheck                                                                                              
	import ChartAreaInteractive from "#lib/components/chart-area-interactive.svelte";                           
	import DataTable from "#lib/components/data-table.svelte";                                                  
	import SectionCards from "#lib/components/section-cards.svelte";                                            
	import dummy_data from "./data.js";                                                                         
																												
	let { data } = $props();                                                                                    
	let is_staff = $derived(data.user?.role === "administrator" || data.user?.role === "editor");               
</script>                                                                                                    
																												
{#if is_staff}                                                                                               
	<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">                                                     
		<SectionCards />                                                                                            
		<div class="px-4 lg:px-6">                                                                                  
			<ChartAreaInteractive />                                                                                    
		</div>                                                                                                      
		<DataTable data={dummy_data} />                                                                             
	</div>                                                                                                      
{:else}                                                                                                      
	<div class="p-6 space-y-6">                                                                                 
		<div class="border rounded-md p-4 space-y-1">                                                               
			<h1 class="text-lg font-semibold">{data.user?.name || "User"}</h1>                                          
			<p class="text-sm text-muted-foreground">{data.user?.email || "-"}</p>                                      
		</div>                                                                                                      
																												
		<div class="space-y-3">                                                                                     
			<h2 class="text-base font-semibold">Status Peminjaman Saya</h2>                                             
			<div class="border rounded-md overflow-x-auto">                                                             
				<table class="w-full text-sm text-left">                                                                    
					<thead class="bg-muted text-muted-foreground border-b">                                                     
						<tr>                                                                                                        
							<th class="p-3 font-medium w-16">ID</th>                                                                    
							<th class="p-3 font-medium">Keperluan</th>                                                                  
							<th class="p-3 font-medium">Arsip</th>                                                                      
							<th class="p-3 font-medium">Durasi</th>                                                                     
							<th class="p-3 font-medium">Status</th>                                                                     
							<th class="p-3 font-medium">Catatan</th>                                                                    
						</tr>                                                                                                       
					</thead>                                                                                                    
					<tbody class="divide-y">                                                                                    
						{#each data.loans ?? [] as item (item.id)}                                                                  
							<tr>                                                                                                        
								<td class="p-3 font-mono text-xs">#{item.id}</td>                                                           
								<td class="p-3 font-medium">{item.purpose}</td>                                                             
								<td class="p-3 text-muted-foreground whitespace-pre-line">{item.title}</td>                                 
								<td class="p-3 text-xs text-muted-foreground">{item.duration}</td>                                          
								<td class="p-3"><span class="badge-status                                                                   
								uppercase">{item.status}</span></td>                                                                        
								<td class="p-3 text-muted-foreground">{item.reason || "-"}</td>                                             
							</tr>                                                                                                       
						{:else}                                                                                                     
							<tr>                                                                                                        
								<td colspan="6" class="p-6 text-center text-muted-foreground">                                              
									Belum ada riwayat permohonan peminjaman.                                                                    
								</td>                                                                                                       
							</tr>                                                                                                       
						{/each}                                                                                                     
					</tbody>                                                                                                    
				</table>                                                                                                    
			</div>                                                                                                      
		</div>                                                                                                      
	</div>                                                                                                      
{/if}             