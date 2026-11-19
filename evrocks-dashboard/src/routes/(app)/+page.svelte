<script>
	// @ts-nocheck
	import { enhance } from "$app/forms";
	import { Button } from "#lib/components/ui/button/index.ts";
	import { Input } from "#lib/components/ui/input/index.ts";
	import { Label } from "#lib/components/ui/label/index.ts";
	import ChartAreaInteractive from "#lib/components/chart-area-interactive.svelte";
	import DataTable from "#lib/components/data-table.svelte";
	import SectionCards from "#lib/components/section-cards.svelte";
	import dummy_data from "./data.js";

	let { data, form } = $props();
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

		<form method="POST" action="?/request_loan" use:enhance class="border rounded-md p-4 space-y-4 bg-muted/20">
			<h2 class="text-base font-semibold">Ajukan Peminjaman Arsip</h2>

			{#if form?.error}
				<div class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
					{form.error}
				</div>
			{/if}

			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-1.5">
					<Label for="loan-purpose">Keperluan Peminjaman</Label>
					<Input id="loan-purpose" name="purpose" required placeholder="Contoh: Penelitian Skripsi" />
				</div>
				<div class="space-y-1.5">
					<Label for="loan-duration">Batas Tanggal Pinjam</Label>
					<Input id="loan-duration" name="duration" type="date" required />
				</div>
			</div>

			<div class="space-y-1.5">
				<Label for="loan-title">Judul / Daftar Arsip yang Dipinjam</Label>
				<Input id="loan-title" name="title" value={data.pinjam} required placeholder="Contoh: Foto Bandung 1990" />
			</div>

			<Button type="submit" size="sm">Kirim Permohonan</Button>
		</form>

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