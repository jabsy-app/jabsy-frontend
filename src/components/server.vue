<script setup lang="ts">
import { Server } from '../models/Server';

interface Props {
  server: Server | null
}

const props = withDefaults(defineProps<Props>(), {
  server: null
})
</script>

<template>
    <div class="container">
        <div class="server pressable">
            <img :src="props.server?.picture">
        </div>
        <span>{{ props.server?.name }}</span>
    </div>
</template>

<style scoped>
    .container {
        position: relative;
        border-radius: 50%;
        margin: var(--gap);
        margin-right: 0;
    }

    .container:has(.server:hover) {
        border-radius: 35%;
    }

    .server:not(:hover) ~ span {
        display: none;
    }

    span {
        --padding-top-bottom: .5em;
        --padding-left-right: 1em;
        isolation: isolate;

        border-radius: 0 var(--gap) var(--gap) var(--gap);
        box-sizing: border-box;
        position: absolute;
        top: var(--server-list-h);
        line-height: 1rem;
        width: max-content;
        z-index: 999;
        left: calc(50% - var(--gap) / 2);
        padding: var(--padding-top-bottom) var(--padding-left-right) var(--padding-top-bottom);
        background: var(--tooltip);
        box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    }

    span::before {
        content: '';
        z-index: -1;
        position: absolute;
        clip-path: polygon(var(--gap) 0%, calc(2 * var(--gap)) var(--gap), 100% var(--gap), 100% 100%, 0 100%, 0% var(--gap));
        background: var(--tooltip);
        left: 0;
        width: calc(2 * var(--gap));
        height: var(--gap);
        bottom: 100%;
    }

    .server {
        position: relative;
        overflow: visible;
        height: calc(var(--server-list-h) - 2 * var(--gap));
        width: calc(var(--server-list-h) - 2 * var(--gap));
        aspect-ratio: 1;
        background: var(--button-color);
        border-radius: 50%;
        cursor: pointer;
        transition: border-radius 150ms ease-in-out, transform 150ms ease;
    }

    .server:hover {
        border-radius: 35%;
    }

    .server:hover img {
        border-radius: 35%;
    }

    .server img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        transition: border-radius 150ms ease-in-out;
    }
</style>