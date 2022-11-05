<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    name: string,
    description: string,
    options: string[] | null,
    state?: number
}

const props = withDefaults(defineProps<Props>(), {
    name: '',
    description: '',
    options: null,
    state: 0
})

const dropdown = ref();

let state = ref(props.state!);

let switchElem = ref();

let dropdownExtended = ref(false)

const getState = () => {
    return state.value;
}

const setState = (num: number) => {
    state.value = num;
}

document.body.addEventListener('click', (event) => {
    if (event.target != dropdown.value && !(dropdown.value as HTMLElement).contains(event.target as Node)) {
        dropdownExtended.value = false;
    }
}, true); 
</script>

<template>
    <div class="container">
        <span class="title">{{ props.name }}</span>
        <span class="description">{{ props.description }}</span>
        <div @click="dropdownExtended = !dropdownExtended" :class="['selected', dropdownExtended ? 'extended' : '']">
            <p>{{ props.options![state] }}</p>
            <i class="chevron-left"></i>
        </div>
        <div ref="dropdown" :style="{'--elems': props.options?.length}" class="dropdown">
            <p class="option" v-for="(option, i) in props.options!" :key="i" @click="state = i; dropdownExtended = false; $emit('selected', i)">{{ option }}</p>
        </div>
    </div>
</template>

<style scoped>

span.title {
    position: absolute;
    bottom: 50%;
    line-height: 1rem;
    left: var(--gap);
}

span.description {
    position: absolute;
    top: 50%;
    line-height: 1rem;
    font-size: .9rem;
    left: var(--gap);
    color: var(--secondary-text)
}

div.container {
    position: relative;
    width: calc(100% - var(--gap) * 2);
    height: 3.5rem;
    margin: var(--gap);
    margin-bottom: 0;
    background: var(--bg);
    border-radius: var(--gap);
}

div.selected {
    background: var(--fg);
    width: 10rem;
    height: 1.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
    border-radius: var(--gap);
    cursor: pointer;
}

div.selected p {
    line-height: 1.5rem;
    margin: 0;
    padding-left: .25rem;
    width: 4.5rem;
}

div.selected i {
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: .25rem;
    right: .25rem;
    transition: transform 300ms ease;
}

div.selected.extended i {
    transform: rotate(-90deg);
}

div.selected:not(.extended) ~ div.dropdown {
    height: 0;
}

div.dropdown {
    box-shadow: inset rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    position: absolute;
    right: 1rem;
    top: 3rem;
    width: 10rem;
    border-radius: var(--gap);
    background: var(--fg);
    box-sizing: border-box;
    overflow: hidden;
    height: calc(var(--elems) * 2rem);
    transition: height 300ms ease;
}

div.dropdown p {
    cursor: pointer;
    height: 1rem;
    line-height: 1rem;
    padding: .5rem;
    margin: 0;
    transition: backdrop-filter 150ms ease;
}

div.dropdown p:hover {
    backdrop-filter: brightness(.9);
}
</style>