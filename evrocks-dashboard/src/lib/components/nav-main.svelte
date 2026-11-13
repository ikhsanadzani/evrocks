<script lang="ts">
	import * as Sidebar from "#lib/components/ui/sidebar/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import type { Component } from "svelte";
	import { page } from "$app/state";

    type NavItem = {
        title: string;
        url: string;
        icon?: Component<any>;
        items?: { title: string; url: string }[];
    };

    let { items }: { items: NavItem[] } = $props();

	function is_menu_active(current_url: { pathname: string; search: string }, menu_url: string): boolean {
        return current_url.pathname + current_url.search === menu_url;
    }
</script>

<Sidebar.Group>
    <Sidebar.GroupContent class="flex flex-col gap-2">
        <Sidebar.Menu>
            {#each items as item (item.title)}
                {@const is_parent_active =
                    item.url === "/"
                        ? page.url.pathname === "/" && !page.url.searchParams.get("tab")
                        : page.url.searchParams.get("tab") === new URL(item.url, "http://localhost").searchParams.get("tab")}

                        <Sidebar.MenuItem>
                    <Sidebar.MenuButton isActive={is_parent_active} tooltipContent={item.title}>
                        {#snippet child({ props })}
                            <a href={item.url} {...props}>
                                {#if item.icon}
                                    <item.icon />
                                {/if}
                                <span>{item.title}</span>
                            </a>
                        {/snippet}
                    </Sidebar.MenuButton>

                    {#if item.items?.length}
                        <Sidebar.MenuSub>
                            {#each item.items as sub_item (sub_item.title)}
                                {@const is_sub_active = is_menu_active(page.url, sub_item.url)}
                                <Sidebar.MenuSubItem>
                                    <Sidebar.MenuSubButton isActive={is_sub_active}>
                                        {#snippet child({ props })}
                                            <a href={sub_item.url} {...props}>
                                                <span>{sub_item.title}</span>
                                            </a>
                                        {/snippet}
                                    </Sidebar.MenuSubButton>
                                </Sidebar.MenuSubItem>
                            {/each}
                        </Sidebar.MenuSub>
                    {/if}
                </Sidebar.MenuItem>
            {/each}
        </Sidebar.Menu>
    </Sidebar.GroupContent>
</Sidebar.Group>