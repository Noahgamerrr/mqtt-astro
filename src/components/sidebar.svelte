<script lang="ts">
    import userLib from "@public/verySecurePasswords.json";
    import { Avatar } from "flowbite-svelte";
    import { GlobeSolid } from "flowbite-svelte-icons";
    import type { ChatRoom } from "src/lib/entities";

    export let changeTopic: (newTopic: string) => void;
    export let currentUser: string;
    export let chatrooms: ChatRoom[];

    let selected = "global";
</script>
<div class="w-[18%] rounded-md mx-2 h-full bg-slate-950">
    {#each chatrooms as chatroom}
        {#if currentUser !== chatroom.name}
            <button 
                class="flex w-[90%] mx-2 pl-2 py-2 rounded-md hover:bg-slate-800 relative" 
                on:click={() => {
                    selected = chatroom.name;
                    changeTopic(chatroom.name);
                }}
                style={selected === chatroom.name ? "background-color: rgb(30,41,59)" : ""}
            >
                {#if chatroom.type === "user"}
                    <Avatar/>
                {:else}
                    <GlobeSolid class="stroke-white w-11 h-11"/>
                {/if}
                
                <p class="mx-2 m-auto text-white">{chatroom.name}</p>
                {#if chatroom.unreadMessages}
                    <div class="w-6 rounded-full bg-red-600 text-white absolute top-8 left-8">
                        {chatroom.unreadMessages}
                    </div>
                {/if}
            </button>
        {/if}
    {/each}
</div>