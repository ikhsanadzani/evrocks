<script lang="ts">
// @ts-nocheck
	import * as Sidebar from "#lib/components/ui/sidebar/index.js";
	import * as Tabs from "#lib/components/ui/tabs/index.js";
	import AppSidebar from "#lib/components/app-sidebar.svelte";
	import ChartAreaInteractive from "#lib/components/chart-area-interactive.svelte";
	import DataTable from "#lib/components/data-table.svelte";
	import SectionCards from "#lib/components/section-cards.svelte";
	import SiteHeader from "#lib/components/site-header.svelte";
	import { page } from "$app/state";
	import dummy_data from "./data.js";	


	// for page post to enable tab
	import ArchiveView from "./post/archive/+page.svelte";
	import ArchiveEditView from "./post/archive/edit/[id]/+page.svelte";
	import ExhibitionView from "./post/exhibition/+page.svelte";
	import LenderView from "./post/lending/+page.svelte";

	let { data } = $props();
	let active_tab = $derived(page.url.searchParams.get("tab") ?? "dashboard");
	let active_view = $derived(page.url.searchParams.get("view") ?? "list");
	

</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />
	<Sidebar.Inset>
		<SiteHeader />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<Tabs.Root value={active_tab} class="w-full">
					<Tabs.Content value="dashboard" class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<SectionCards />
                        <div class="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        <DataTable data={dummy_data} />
					</Tabs.Content>
					<!-- for archive view tab -->
					<Tabs.Content value="archive">
						{#if active_view === "edit"}
							{#if data.editing_archive}
								<ArchiveEditView data={{ archive: data.editing_archive }} {form} />
							{:else}
								<div class="p-6 text-sm text-muted-foreground">
									Pilih item dari daftar <strong>All Archives</strong> terlebih dahulu untuk diedit.
								</div>
							{/if}
						{:else}
							<ArchiveView data={{ archives: data.archives }} />
						{/if}
					</Tabs.Content>
					<!-- for exhibition view tab -->
					<Tabs.Content value="exhibition">
                        <ExhibitionView data={{ exhibitions: data.exhibitions }} />
                    </Tabs.Content>
					<!-- for lending view tab -->
					<Tabs.Content value="lender">
                        <LenderView data={{ loans: data.loans }} />
                    </Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
