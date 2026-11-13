<script lang="ts">
    import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
    import CirclePlusFilledIcon from "@tabler/icons-svelte/icons/circle-plus-filled";
    import MailIcon from "@tabler/icons-svelte/icons/mail";
    import * as Collapsible from "#lib/components/ui/collapsible/index.js";
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

    const is_sub_active = (url: string) =>
        page.url.pathname + page.url.search === url;

    const is_parent_active = (url: string) => {
        const current_tab = page.url.searchParams.get("tab");
        if (url === "/") return page.url.pathname === "/" && !current_tab;
        return current_tab === new URLSearchParams(url.split("?")[1]).get("tab");
    };
</script>

{#snippet button_content(item: NavItem, expandable = false)}
    {#if item.icon}
        <item.icon />
    {/if}
    <span>{item.title}</span>
    {#if expandable}
        <ChevronRightIcon
            class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
        />
    {/if}
{/snippet}

<Sidebar.Group>
    <Sidebar.GroupContent class="flex flex-col gap-2">
        <Sidebar.Menu>
            {#each items as item (item.title)}
                {@const active = is_parent_active(item.url)}

                {#if item.items?.length}
                    <Collapsible.Root open={active} class="group/collapsible">
                        <Sidebar.MenuItem>
                            <Collapsible.Trigger>
                                {#snippet child({ props })}
                                    <Sidebar.MenuButton {...props} isActive={active} tooltipContent={item.title}>
                                        {@render button_content(item, true)}
                                    </Sidebar.MenuButton>
                                {/snippet}
                            </Collapsible.Trigger>

                            <Collapsible.Content>
                                <Sidebar.MenuSub class="border-red-600">
                                    {#each item.items as sub (sub.title)}
                                        <Sidebar.MenuSubItem>
                                            <Sidebar.MenuSubButton isActive={is_sub_active(sub.url)}>
                                                {#snippet child({ props })}
                                                    <a href={sub.url} {...props}>
                                                        <span>{sub.title}</span>
                                                    </a>
                                                {/snippet}
                                            </Sidebar.MenuSubButton>
                                        </Sidebar.MenuSubItem>
                                    {/each}
                                </Sidebar.MenuSub>
                            </Collapsible.Content>
                        </Sidebar.MenuItem>
                    </Collapsible.Root>
                {:else}
                    <Sidebar.MenuItem>
                        <Sidebar.MenuButton isActive={active} tooltipContent={item.title}>
                            {#snippet child({ props })}
                                <a href={item.url} {...props}>
                                    {@render button_content(item)}
                                </a>
                            {/snippet}
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                {/if}
            {/each}
        </Sidebar.Menu>
    </Sidebar.GroupContent>
</Sidebar.Group>