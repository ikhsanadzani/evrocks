<script lang="ts">
	import './layout.css';
	import logo from '#lib/assets/logo.png';
	import { ModeWatcher } from 'mode-watcher';
	import { toggleMode } from 'mode-watcher';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ModeWatcher />
<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>

{@render children()}
