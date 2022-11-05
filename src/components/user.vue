<script setup lang="ts">
import { ref } from 'vue';
import { User } from '../models/user'

interface Props {
  user: User | null,
  userClick: (s: string, y: string, user: User) => void
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  userClick: (x, y, u) => {}
})

let click = () => props.userClick('calc(100% - var(--sidebar-w) - 2 * var(--gap) - 15rem)', elem.value.getBoundingClientRect().top + "px", props.user!);

let elem = ref();
</script>

<template>
    <div ref="elem" @click="click" class="user pressable">
        <img :src=props.user?.ProfilePicture>
        <p>{{ props.user?.Name }}</p>
    </div>
</template>

<style scoped>
    .user {
        position: relative;
        display: block;
        width: calc(var(--sidebar-w) - 2 * var(--gap));
        height: var(--user-h);
        background: var(--button-color);
        margin: var(--gap);
        margin-bottom: 0;
        border-radius: var(--gap);
        transition: backdrop-filter 150ms ease, transform 150ms ease;
        cursor: pointer;
    }

    .user:hover {
        backdrop-filter: brightness(0.9);
    }

    .user p {
        width: calc(var(--sidebar-w) - 3 * var(--gap));
        height: var(--user-h);
        line-height: var(--user-h);
        padding-left: calc(var(--user-h));
        margin: 0;
        box-sizing: border-box;
        margin-right: var(--gap);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .user img {
        height: calc(var(--user-h) - 2 * var(--gap));
        width: calc(var(--user-h) - 2 * var(--gap));
        position: absolute;
        inset: var(--gap);
        border-radius: 50%;
    }
</style>