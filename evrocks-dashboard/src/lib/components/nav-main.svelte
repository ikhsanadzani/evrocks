<script lang="ts">
	import CirclePlusFilledIcon from "@tabler/icons-svelte/icons/circle-plus-filled";
	import MailIcon from "@tabler/icons-svelte/icons/mail";
	import * as Sidebar from "#lib/components/ui/sidebar/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { Icon } from "@tabler/icons-svelte";
	import { page } from "$app/state";

	let { items }: { items: { title: string; url: string; icon?: Icon }[] } = $props();

	function is_menu_active(current_url: URL, menu_url: string): boolean {
        const current_full_path = current_url.pathname + current_url.search;
        return current_full_path === menu_url;
    }
</script>

<Sidebar.Group>
    <Sidebar.GroupContent class="flex flex-col gap-2">
        <Sidebar.Menu>
            <Sidebar.MenuItem class="flex items-center gap-2">
                <Sidebar.MenuButton
                    class="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                    tooltipContent="Quick create"
                >
                    <CirclePlusFilledIcon />
                    <span>Quick Create</span>
                </Sidebar.MenuButton>
                <Button
                    size="icon"
                    class="size-8 group-data-[collapsible=icon]:opacity-0"
                    variant="outline"
                >
                    <MailIcon />
                    <span class="sr-only">Inbox</span>
                </Button>
            </Sidebar.MenuItem>
        </Sidebar.Menu>

        <Sidebar.Menu>
            {#each items as item (item.title)}
                {@const is_active = is_menu_active(page.url, item.url)}

                <Sidebar.MenuItem>
                    <Sidebar.MenuButton isActive={is_active} tooltipContent={item.title}>
                        {#snippet child({ props })}
                            <a href={item.url} {...props}>
                                {#if item.icon}
                                    <item.icon />
                                {/if}
                                <span>{item.title}</span>
                            </a>
                        {/snippet}
                    </Sidebar.MenuButton>
                </Sidebar.MenuItem>
            {/each}
        </Sidebar.Menu>
    </Sidebar.GroupContent>
</Sidebar.Group>