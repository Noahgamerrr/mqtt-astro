<script lang="ts">
    import type { ChatRoom } from "src/lib/entities";
    import Login from "./login.svelte";
    import MqttClient from "./mqttClient.svelte";

    export let user: string;
    export let chatrooms: ChatRoom[];
    export let errorMessage: string;
</script>
{#if user} 
    <MqttClient currentUser={user} {chatrooms}/>
{:else}
    <Login {errorMessage}/>
{/if}
