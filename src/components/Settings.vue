<script setup lang="ts">
import OptionSwitch from './OptionSwitch.vue';
import OptionDropdown from './OptionDropdown.vue';
import { Theme } from '../models/theme';
import { Ref, ref } from 'vue';
import { useStore } from 'vuex';

let initFinished = ref(false);

interface Props {
    themes: Theme[] | null
}

const props = withDefaults(defineProps<Props>(), {
    themes: null
})

const store = useStore();

let themeSelected: Ref<number | undefined> = ref(undefined);
let themeOptions: Ref<string[]> = ref([]);

props.themes?.forEach((theme) => {
    themeOptions.value.push(theme.name)
});

async function init() {
    themeSelected.value = await store.dispatch('getStore', 'themeSelected');
    initFinished.value = true;
}

init()

</script>

<template>
    <div v-if="initFinished" class="settings">
        <div @click="$emit('close')" class="cross"><i class="cross"></i></div>
        <content>
            <h1>Settings</h1>
            <div>
                <OptionDropdown name="Theme" description="A theme decides the colors of the app." :state="themeSelected!" :options="themeOptions" @selected="(i: number) => { themeSelected = i; $emit('themeSelected', i); store.dispatch('store', { name: 'themeSelected', value: i }); }"></OptionDropdown>
            </div>
        </content>
    </div>
</template>

<style scoped>
    .settings {
        background: var(--bg);
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        isolation: isolate;
        transition: scale 150ms ease 20ms, opacity 150ms ease 20ms;
        display: grid;
        place-items: center;
    }

    .settings div.cross {
        font-size: 1.5rem;
        position: absolute;
        top: calc(2 * var(--gap));
        right: calc(2 * var(--gap));
        border: 2px var(--text) solid;
        padding: var(--gap);
        border-radius: 50%;
        display: grid;
        place-items: center;
        cursor: pointer;
    }

    content {
        display: block;
        position: fixed;
        width: var(--settings-w);
        height: calc(100% - 2 * var(--gap));
        border-radius: var(--gap);
        padding: var(--gap);
        box-sizing: border-box;
        background: var(--fg);
    }
</style>