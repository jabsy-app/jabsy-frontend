<script setup lang="ts">
    import { Server } from "../models/Server";
    import channel from "./channel.vue";

    interface Props {
        server?: Server
    }

    const props = defineProps<Props>();
</script>

<template>
    <div class="channel-list">
        <channel @connect="i => $emit('connect', i)" v-for="(channel, i) in server?.channels" :i="i" :key="i" :channel="channel"></channel>
    </div>
</template>

<style scoped>
.channel-list {
    top: calc(2 * var(--gap) + var(--server-list-h));
    left: var(--gap);
    width: var(--sidebar-w);
    bottom: var(--gap);
    padding-bottom: var(--gap);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>