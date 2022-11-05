<script setup lang="ts">
import { Channel } from '../models/Server';

interface Props {
  channel: Channel | null,
  i: number
}

const props = withDefaults(defineProps<Props>(), {
  channel: null,
  i: 0
})
</script>

<template>
    <div @click="$emit('connect', i)" class="channel pressable">{{ channel?.name }}</div>
</template>

<style scoped>
    .channel {
        width: calc(var(--sidebar-w) - 2 * var(--gap));
        height: var(--channel-h);
        line-height: calc(var(--channel-h) - 2 * var(--gap));
        background: var(--button-color);
        margin: var(--gap);
        margin-bottom: 0;
        padding: var(--gap);
        box-sizing: border-box;
        border-radius: var(--gap);
        transition: backdrop-filter 150ms ease, transform 150ms ease;
        cursor: pointer;
    }

    .channel:hover {
        backdrop-filter: brightness(0.9);

    }
</style>