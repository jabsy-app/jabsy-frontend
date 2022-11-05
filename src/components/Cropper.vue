<script setup lang="ts">
import { Ref, ref, watch } from 'vue';

let props = defineProps<{
    src: string,
    dim: {
        w: number,
        h: number
    },
    selector: {
        top: number,
        left: number,
        width: number,
        height: number,
        radius: number
    }
}>();

let aspect = props.dim.w / props.dim.h;
let src = ref(props.src);
let selectorStyle = ref(props.selector);
let scale = ref(aspect >= props.selector.width / props.selector.height ?
    props.selector.width
    :
    props.selector.height * aspect
)
let image: Ref<HTMLElement | undefined> = ref();
let offsetTop = ref(props.selector.top);
let offsetLeft = ref(props.selector.left);

watch(() => props.src, (newValue) => {
    offsetTop.value = props.selector.top;
    offsetLeft.value = props.selector.left;
    src.value = newValue;
    scale.value = aspect < props.selector.width / props.selector.height ?
        props.selector.width
        :
        props.selector.height * aspect
    ;
})

watch(() => props.selector, (newValue) => {
    selectorStyle.value = newValue;
})

watch(() => props.dim, (newValue) => {
    aspect = newValue.w / newValue.h;
    scale.value = aspect < props.selector.width / props.selector.height ?
        props.selector.width
        :
        props.selector.height * aspect
    ;
})

watch(() => props.selector.width, (newValue) => {
    scale.value = aspect < newValue / props.selector.height ?
        newValue
        :
        props.selector.height * aspect
    ;
})

watch(() => props.selector.top, (newValue) => {
    offsetTop.value = newValue;
})

watch(() => props.selector.left, (newValue) => {
    offsetLeft.value = newValue;
})

function scroll(e: Event) {
    //@ts-ignore
    let delta: number = e.wheelDelta;

    scale.value += delta > 0 ? ((props.dim.w < props.dim.h ? scale.value : image.value?.offsetHeight!) < 500 ? 2 : 0) : ((props.dim.w < props.dim.h ? scale.value : image.value?.offsetHeight!) > props.selector.width ? -2 : 0);
    if (offsetLeft.value + scale.value < (props.selector.left + props.selector.width)) {
        offsetLeft.value += (props.selector.left + props.selector.width) - (offsetLeft.value + scale.value);
    }
    if (offsetTop.value + image.value?.offsetHeight! < (props.selector.top + props.selector.height)) {
        offsetTop.value = props.selector.top + props.selector.height - image.value?.offsetHeight!;
    }
}

var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

function dragMouseDown(e: Event) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    //@ts-ignore
    pos3 = e.clientX;
    //@ts-ignore
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
}

function elementDrag(e: Event) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    //@ts-ignore
    pos1 = pos3 - e.clientX;
    //@ts-ignore
    pos2 = pos4 - e.clientY;
    //@ts-ignore
    pos3 = e.clientX;
    //@ts-ignore
    pos4 = e.clientY;
    // set the element's new position:
    if ((offsetTop.value - pos2) <= props.selector.top && (offsetTop.value - pos2 + image.value?.offsetHeight!) >= (props.selector.top + props.selector.height)) {
        offsetTop.value = (offsetTop.value - pos2);
    }

    if ((offsetLeft.value - pos1) <= props.selector.left && (offsetLeft.value - pos1 + image.value?.offsetWidth!) >= (props.selector.left + props.selector.width)) {
        offsetLeft.value = (offsetLeft.value - pos1);
    }
}

function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
}

function getData() {
    return {
        scale: scale.value,
        offset: {
            x: offsetLeft.value,
            y: offsetTop.value
        }
    }
}
</script>

<template>
<div :style="{
        '--l': selector.left + 'px',
        '--t': selector.top + 'px',
        '--w': selector.width + 'px',
        '--h': selector.height + 'px',
        '--r': selector.radius + 'px',
    }"  class="popup">
    <div class="container">
        <img 
        ref="image"
        :style="{
            width: scale + 'px',
            top: offsetTop + 'px',
            left: offsetLeft + 'px'
        }" 
        @wheel.prevent="scroll" 
        @mousedown="dragMouseDown"
        :src="src">
    </div>
    <div>
        <button @click="$emit('cancel')" id="cancel">Cancel</button>        
        <button @click="$emit('apply', getData())" id="apply">Apply</button>        
    </div>
</div>
</template>

<style scoped>
div:has(button) {
    margin: 0 .5rem .5rem .5rem;
    height: 2.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

button {
    font-size: 1rem;
    padding: .5rem 1rem;
    margin: .5rem 0 .5rem .5rem;
}

#apply {
    background-color: var(--tooltip);
}

#cancel {
    background-color: var(--button-color);
}

button:hover {
    backdrop-filter: brightness(.9);
}

.popup {
    background-color: var(--bg);
    width: 16rem;
    height: 19rem;

    position: absolute;
    top: calc(50vh - 10rem);
    left: calc(50vw - 16rem / 2);
    z-index: 9000;
    overflow: hidden;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.container {
    position: relative;
    width: 15rem;
    height: 15rem;
    margin: .5rem;
    border-radius: .5rem;

    background-color: var(--fg);
    overflow: hidden;
}

.container::after {
    content: '';
    position: absolute;
    top: var(--t);
    left: var(--l);
    border: 3px solid #fff;
    mix-blend-mode: difference;
    width: var(--w);
    height: var(--h);
    box-sizing: border-box;
    border-radius: var(--r);
    pointer-events: none;
}

.container img {
    position: absolute;
}
</style>