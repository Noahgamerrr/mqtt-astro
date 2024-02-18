<script lang="ts">
    import { Button, Modal } from "flowbite-svelte";
    import type { Message } from "../lib/entities";
    import { TrashBinSolid } from "flowbite-svelte-icons";

    export let message: Message;
    export let currentUser: string;
    export let deleteMessage: (uuid: string) => void;

    let showDeleteButton = false;
    let deleteModal = false;
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="bg-blue-900 rounded-xl px-4 pb-2 my-1 relative" 
    on:mouseover={() => showDeleteButton = true}
    on:mouseleave={() => showDeleteButton = false}
>
    <div class="flex justify-between text-gray-300 text-lg">
        <p>{message.user}</p>
        <p>{message.date}</p>
    </div>
    <div class="text-white">
        <p class="text-2xl">{message.message}</p>
    </div>
    {#if showDeleteButton && currentUser == message.user}
        <button class="absolute bottom-0 right-4" on:click={() => deleteModal = true}>
            <TrashBinSolid size="xl"/>
        </button>
    {/if}
</div>
<Modal title="Confirm deletion" bind:open={deleteModal} autoclose>
    <p>You are about to delete a message:</p>
    <p><b>{message.message}</b></p>
    <p>Are you sure you want to proceed?</p>
    <svelte:fragment slot="footer">
        <Button
            color="red"
            on:click={(e) => {
                deleteMessage(message.uuid);
            }}>Confirm deletion</Button
        >
        <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>