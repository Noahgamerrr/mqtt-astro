<script lang="ts">
    import { Input } from "flowbite-svelte";
    import { MQTT } from "../lib/mqtt";
    import type { Message, ChatRoom } from "../lib/entities";
    import MessageElement from "./message.svelte";
    import Sidebar from "./sidebar.svelte";

    export let currentUser: string;
    export let chatrooms: ChatRoom[];

    let messages: Record<string, Message[]> = {};
    let suffix = "global";
    let value = "";

    function payloadToMessage(payload: String): Message {
        const messageData = payload.toString().split("\n");
        const uuid = messageData.shift();
        const user = messageData.shift() as string;
        const date = messageData.shift();
        const message = messageData.join("\n");
        return {
            uuid,
            user,
            date,
            message
        } as Message;
    }

    function removeMessage(uuid: string) {
        for (let key of Object.keys(messages)) {
            const deletedMessage = messages[key].find(m => m.uuid === uuid);
            messages[key] = messages[key].filter(m => m.uuid !== uuid);
            if (deletedMessage) {
                let user = chatrooms.find(u => u.name === key);
                if (user && user.unreadMessages) user.unreadMessages--;
                chatrooms = chatrooms;
            }
        }
        messages = messages;
    }

    const onMessage = (topic: string, payload: Buffer) => {
        const payloadStr = payload.toString();
        if (payloadStr.startsWith("DELETE MESSAGE ")) {
            const uuid = payloadStr.split(" ").pop() as string;
            removeMessage(uuid);
            return;
        }
        const message = payloadToMessage(payloadStr);
        let chatRoom = topic.split("/").pop() as string;
        if (chatRoom === currentUser) chatRoom = message.user;
        if (!messages[chatRoom]) messages[chatRoom] = [];
        if (messages[chatRoom].find(e => e.uuid == message.uuid)) return;
        messages[chatRoom].push(message);
        messages = messages;
        if (chatRoom !== suffix) {
            let user = chatrooms.find(u => u.name === chatRoom);
            if (user) user.unreadMessages++;
            chatrooms = chatrooms;
        }
    }

    const MqttClient: MQTT = new MQTT(currentUser, onMessage);

    const changeTopic = (newTopic: string) => {
        suffix = newTopic;
        let user = chatrooms.find(u => u.name === suffix);
        if (user) user.unreadMessages = 0;
        chatrooms = chatrooms;
    }

    const deleteMessage = (uuid: string) => {
        MqttClient.deleteMessage(suffix, uuid);
        messages[suffix] = messages[suffix].filter(m => m.uuid !== uuid);
        messages = messages;
    }

    function sendMessage() {
        const payload = MqttClient.publish(suffix, currentUser, value);
        if (!messages[suffix]) messages[suffix] = [];
        messages[suffix].push(payloadToMessage(payload));
        messages = messages;
        value = "";
    }
</script>
<div class="p-1 h-full">
    <div class="flex h-[94%]">
        <Sidebar chatrooms={chatrooms} {currentUser} {changeTopic}/>
        <div class="h-full w-[80%]">
            {#if messages[suffix]}
                {#each messages[suffix] as message}
                    <MessageElement {deleteMessage} {currentUser} {message}/>
                {/each}
            {/if}
        </div>
    </div>
    <Input
        class="fixed bottom-1 w-[99%] h-[5%]"
        bind:value
        placeholder="Write something..."
        on:keypress={(e) => {
            if (e.key == "Enter") sendMessage();
        }}
    />
</div>

