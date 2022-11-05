<script setup lang="ts">
import { ref } from 'vue';
import { ChatMessage } from '../models/message';
import { User } from '../models/user';

interface Props {
  message: ChatMessage | null,
  userClick: (x: string, y: string, user: User) => void
}

const props = withDefaults(defineProps<Props>(), {
  message: null,
  userClick: (x, y, u) => {}
})

let pfp = ref();

const click = () => props.userClick('calc(5 * var(--gap) + var(--sidebar-w) + 3rem)', pfp.value.getBoundingClientRect().top + "px", props.message?.user!);
</script>

<template>
    <div>
        <img ref="pfp" @click="click" :src=props.message?.user?.ProfilePicture>
        <span class="name">{{ props.message?.user?.Name }}</span>
        <span class="time">{{ props.message?.time }}</span>
        <p>
            {{ props.message?.text }}
        </p>
    </div>
</template>

<style scoped>
    div {
        width: 100%;
        position: relative;
    }

    img {
        position: absolute;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;

        inset: var(--gap);
        cursor: pointer;
    }

    .name {
        --font-size: 1.2rem;

        position: absolute;
        left: calc(var(--gap) * 2 + 3rem);
        font-size: var(--font-size);
        line-height: var(--font-size);
        top: calc(var(--gap) + (3rem - var(--font-size)) / 2)
    }

    .time {
        --font-size: .9rem;

        position: absolute;
        right: var(--gap);
        font-size: var(--font-size);
        line-height: var(--font-size);
        top: calc(var(--gap) + (3rem - var(--font-size)) / 2);
        color: var(--secondary-text);
    }

    p {
        position: relative;
        margin: var(--gap);
        margin-top: calc(2 * var(--gap) + 3rem);
    }
</style>