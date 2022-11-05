<script setup lang="ts">
    import user from "./user.vue";
    import { User } from '../models/user'


    interface Props {
        users?: User[],
        userClick: (x: string, y: string, user: User) => void
    }

    const props = withDefaults(defineProps<Props>(), {
        userClick: (x, y, u) => {}
    })
</script>

<template>
    <div class="user-list">
        <user 
        :userClick="props.userClick"
        v-for="u in users"
        :user="u"
        ></user>
                
    </div>
</template>

<style scoped>
.user-list {
    width: var(--sidebar-w);
    top: var(--gap);
    right: var(--gap);
    bottom: calc(var(--current-user-h) + 2 * var(--gap));
    padding-bottom: var(--gap);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>