<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ChatMessage } from '../models/message';
import { Channel } from '../models/Server';
import { User } from '../models/user';
import Message from './Message.vue';

const store = useStore();

interface Props {
    name: string,
    channel: Channel | null,
    userClick: (x: string, y: string, user: User) => void
}

const props = withDefaults(defineProps<Props>(), {
    name: '',
    channel: null,
    userClick: (x, y, u) => {}
})

let messages: Ref<ChatMessage[]> = ref([]);

async function init() {
    messages.value.push({
        user: await store.dispatch('getUser', 8),
        text: "Hello, world!",
        time: "14:30 12.4.2022"
    } as ChatMessage);
}

init();

watch(() => props.channel!, (o, n) => {

});
</script>

<template>
    <div class="chat">
        <div v-if="channel != null">
            <span>{{ name }} <i v-if="name.length > 0 && channel != null" class="chevron-right"></i> {{ channel?.name }}</span>
            <div class="messages">
                <Message
                :userClick="userClick"
                v-for="message in messages"
                :message="message"></Message>
            </div>
            <input type="text" placeholder="Type here to chat...">
        </div>
        <div v-else class="else">
            <span><i class="globe-crossed"></i><br>Not Connected to any server</span>
        </div>
    </div>
</template>

<style scoped>
div.else {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}

div.else span {
    text-align: center;
    font-size: 3rem;
}

div.else i {
    font-size: 15rem;
}

.chat {
    --font-size: 1.2rem;

    top: calc(var(--server-list-h) + 2 * var(--gap));
    bottom: var(--gap);
    left: calc(var(--sidebar-w) + 2 * var(--gap));
    right: calc(var(--sidebar-w) + 2 * var(--gap));
}

.chat > div:not(.else) > span {
    position: absolute;
    height: 1.2rem;
    inset: var(--gap);
    overflow: hidden;
    word-wrap: unset;
    text-overflow: ellipsis;
}

input {
    position: absolute;
    left: var(--gap);
    bottom: var(--gap);
    width: calc(100% - 4 * var(--gap));
    height: calc(var(--font-size) + var(--gap));
    padding: var(--gap);
    border-radius: var(--gap);
    border: none;
    background-color: var(--bg);
    color: var(--text);
    font-size: var(--font-size);
    line-height: var(--font-size);
}

input:focus {
    outline: none;
}

.messages {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    position: absolute;
    inset: var(--gap);
    top: calc(2 * var(--gap) + 1rem);
    bottom: calc(5 * var(--gap) + var(--font-size));
    overflow-y: scroll;
}
</style>