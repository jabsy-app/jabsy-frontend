<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    name: string,
    description: string,
    state?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    name: '',
    description: '',
    state: false
})

let state = ref(props.state);

let switchElem = ref();

const switchClick = () => {
    state.value = !state.value;
}

const getState = () => {
    return state.value;
}

const setState = (on: boolean) => {
    state.value = on;
}
</script>

<template>
    <div class="container">
        <span class="title">{{ props.name }}</span>
        <span class="description">{{ props.description }}</span>
        <div @click="switchClick" ref="switchElem" :class="['switch', state ? 'on' : '']"></div>
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

.switch {
    width: 2.7rem;
    height: 1.5rem;
    background: #ccc5b9;
    position: absolute;
    right: var(--gap);
    top: calc(50% - 1.5rem / 2);
    border-radius: 9999px;
    cursor: pointer;
    transition: background 120ms ease;
}

.switch.on {
    background: #80ed99;
}

.switch::after {
    content: '';
    position: absolute;
    top: .2rem;
    left: .2rem;
    bottom: .2rem;
    z-index: 100;
    border-radius: 50%;
    background: #f1f1f1;
    height: 1.1rem;
    width: 1.1rem;
    transition: left 150ms ease;
}

.switch.on::after {
    left: 1.4rem;
}
</style>