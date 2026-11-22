<script>
    //@ts-nocheck
    import * as Card from "#lib/components/ui/card/index.js";
    import { Button } from "#lib/components/ui/button/index.ts";
    import { fi } from "zod/v4/locales";

    let {
        title = "Digital File",
        description = "",
        item,
        empty_text = "gaada"
    } = $props();

    let file = $derived.by(() => {
        const list = [...(item?.attachments ?? [])];
        if (item?.file_digital && !list.some((f) => f.url === item.file_digital)) {
            list.unshift({
                id: "digital",
                title: item.file_digital.split("/").pop() || "File Digital",
                url: item.file_digital,
                mime_type:item.file_digital.toLowerCase().endsWith(".pdf") ? "application/pdf" : ""
            });
        }
        return list;
    })

    const is_image = (f) => Boolean(f?.mime_type?.startsWith("image/")) || /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(f?.url ?? "");
    const is_pdf = (f) => f?.mime_type === "application/pdf" || /\.pdf(\?.*)?$/i.test(f?.url ?? "");

</script>

<Card.Root>
    <Card.Header>
        <Card.Title>
            {#if description}
                <Card.Description></Card.Description>
            {/if}
        </Card.Title>
    </Card.Header>

    <Card.Content>
        {#if item?.featured_image_url}
            <img src={item.featured_image_url} alt={item.raw_title} />
        {/if}

        {#each files as file (file.id)}
            <div>
                {#if item?.featured_image_url}
                    <img src={file.url} alt={file.title}>

                {:else if is_pdf(file)}
                    <iframe src={file.url} title={file.title}></iframe>
                {/if}

                <div>
                    <span>{file.title}</span>
                    <Button>Open / Download</Button>
                </div>
            </div>
        {:else}
            {#if !item?.featured_image_url}
                <p>{empty_text}</p>
            {/if}
        {/each}
    </Card.Content>
</Card.Root>