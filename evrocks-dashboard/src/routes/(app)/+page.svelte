<script>
	import ChartAreaInteractive from "#lib/components/chart-area-interactive.svelte";
	import DataTable from "#lib/components/data-table.svelte";
    import SectionCards from "#lib/components/section-cards.svelte";
	import dummy_data from "./data.ts";
</script>

<div>
	<SectionCards />
	<div>
		<ChartAreaInteractive />
	</div>
	<DataTable data={dummy_data} />
</div>