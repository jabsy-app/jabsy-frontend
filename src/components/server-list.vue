<script setup lang="ts">
    import { Server } from "../models/Server";
    import server from "./server.vue";

    interface Props {
        servers?: Server[]
    }

    const props = defineProps<Props>();
</script>

<template>
    <div class="server-list">
        <server v-for="(s, i) in servers!" @click="$emit('connect', s)" :key="i" :server="s"></server>
    </div>
</template>

<style scoped>
.server-list {
    top: var(--gap);
    left: var(--gap);
    right: calc(var(--sidebar-w) + 2 * var(--gap));
    height: var(--server-list-h);
    display: flex;
    padding-right: var(--gap);
    flex-direction: row;
    overflow-x: scroll;
    overflow-x: visible;
}
</style>