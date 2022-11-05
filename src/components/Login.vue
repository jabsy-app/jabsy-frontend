<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri';
import { createObjectExpression } from '@vue/compiler-core';
import { Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { createUser, emailExists, User, getSalt, login } from '../models/user'
import Checkbox from './Checkbox.vue'
import Cropper from './Cropper.vue';

const store = useStore();

const emit = defineEmits<{
    (e: 'login', user: User): void
}>()

let showCropper = ref(false);
let selectorStyle = ref({
    left: 4*16,
    top: 4*16,
    width: 7*16,
    height: 7*16,
    radius: 4.5*16
});
let dim = ref({
    w: 0,
    h: 0
});
let minScale = ref(7*16);
let offsetX = ref(4*16);
let offsetY = ref(4*16);

let logEmail: Ref<HTMLInputElement | undefined> = ref();
let logPwd: Ref<HTMLInputElement | undefined> = ref();
let regEmail: Ref<HTMLInputElement | undefined> = ref();
let regUsername: Ref<HTMLInputElement | undefined> = ref();
let regPwd: Ref<HTMLInputElement | undefined> = ref();
let regPwdCheck: Ref<HTMLInputElement | undefined> = ref();

let remember = ref(false);
let message = ref('');
let username = ref('');
let email = ref('');
let pwd = ref('');
let pwdCheck = ref('');
let pfp = ref("data:image/png;base64,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");
let hero = ref("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAABgBAMAAADRHeLiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURdnZ2YrXJ0MAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAhSURBVGje7cEBAQAAAIIg/6+uIUAAAAAAAAAAAAAAAFwNLWAAAT7QLOkAAAAASUVORK5CYII=");



interface Props {
    loginPage: number,
    loading: boolean
}

let props = withDefaults(defineProps<Props>(), {
    loginPage: 0,
    loading: true
})

let loginPage = ref(props.loginPage)
let loading = ref(props.loading)

watch(() => props.loginPage, async (newValue) => {
    loginPage.value = newValue;
})

watch(() => props.loading, async (newValue) => {
    loading.value = newValue;
})

const displayPfp: Ref<HTMLElement | undefined> = ref();

const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

var img = document.createElement("img");
img.style.display = "none";


const onPfpChange = async (event: Event) => {
    //@ts-ignore
    const file = event.target.files[0];
    const base64 = await convertBase64(file) as string;
    img.onload = function (event)
    {
        pfp.value = base64;
        dim.value = {
            w: img.naturalWidth,
            h: img.naturalHeight
        }
        showCropper.value = true;
    }
    img.src = base64;
    document.body.appendChild(img);
};

const onHeroChange = async (event: Event) => {
    //@ts-ignore
    const file = event.target.files[0];
    const base64 = await convertBase64(file) as string;
    img.onload = function (event)
    {
        hero.value = base64;
        dim.value = {
            w: img.naturalWidth,
            h: img.naturalHeight
        }
        showCropper.value = true;
    }
    img.src = base64;
    document.body.appendChild(img);
};

async function applyPfp(cropInfo: {
    scale: number,
    offset: {
        x: number,
        y: number
    }
}) {
    console.log(JSON.stringify(cropInfo))
    loading.value = true;
    pfp.value = await invoke("shrink_image", {
        img: pfp.value,
        x: 7*16,
        y: 7*16,
        x2: Math.round((64 - cropInfo.offset.x)/(cropInfo.scale/img.naturalWidth)),
        y2: Math.round((64 - cropInfo.offset.y)/(cropInfo.scale/img.naturalWidth)),
        w: Math.round(img.naturalWidth/(cropInfo.scale/112)),
        h: Math.round(img.naturalWidth/(cropInfo.scale/112))
    });
    loading.value = false;
    showCropper.value = false;
}

async function applyHero(cropInfo: {
    scale: number,
    offset: {
        x: number,
        y: number
    }
}) {
    console.log(JSON.stringify(cropInfo))
    loading.value = true;
    try {
        hero.value = await invoke("shrink_image",
        {
            img: hero.value,
            x: 15*16,
            y: 6*16,
            x2: Math.round(-cropInfo.offset.x/(cropInfo.scale/img.naturalWidth)),
            y2: Math.round((4*16 - cropInfo.offset.y)/(cropInfo.scale/img.naturalWidth)),
            w: Math.round(img.naturalWidth*((15*16)/cropInfo.scale)),
            h: Math.round(img.naturalWidth*((6*16)/cropInfo.scale))
        });
    }
    finally {}
    loading.value = false;
    showCropper.value = false;
}

async function Login() {
    logEmail.value?.setCustomValidity("");
    loading.value = true;
    message.value = "";

    let emailInvalid = email.value.length == 0;
    let pwdInvalid = pwd.value.length == 0;

    logEmail.value?.setCustomValidity(emailInvalid ? "invalid" : "");
    logPwd.value?.setCustomValidity(pwdInvalid ? "invalid" : "");

    if (emailInvalid || pwdInvalid) {
        message.value = "All fields have to be filled out."
        loading.value = false;
        return;
    }   

    let salt = await getSalt(email.value);

    if (!salt) {
        message.value = "User doesn't exist. Did you mean to sign up?"
        logEmail.value?.setCustomValidity("invalid");
        loading.value = false;
        return;
    }
    let pass = await invoke("hash_from_salt", {
        password: pwd.value,
        saltStr: salt
    }) as string;

    let result = await login(email.value, pass);
    if (!result) {
        message.value = "Password incorrect."
        logPwd.value?.setCustomValidity("invalid");
        loading.value = false;
        return;
    }

    if (remember.value) {
        store.dispatch('store', {
        name: 'login',
        value: {
            email: email.value,
            pwd: pass
        }
    });
    }

    emit('login', result);
    loading.value = false;
}

function proceedRegistering() {
    minScale.value = 7*16;
    selectorStyle.value = {
        left: 4*16,
        top: 4*16,
        width: 7*16,
        height: 7*16,
        radius: 4.5*16
    };
    offsetX.value = 4*16;
    message.value = "";
    loading.value = true;
    emailExists(email.value).then(res => {
        let usernameInvalid = username.value.replace(' ', '').length == 0;
        let emailInvalid = email.value.replace(' ', '').length == 0 || res;
        let pwdInvalid = pwd.value.replace(' ', '').length == 0 || pwd.value != pwdCheck.value;
        let pwdCheckInvalid = pwdCheck.value.replace(' ', '').length == 0 || pwd.value != pwdCheck.value;

        regUsername.value?.setCustomValidity(usernameInvalid ? "invalid" : "");
        regEmail.value?.setCustomValidity(emailInvalid ? "invalid" : "");
        regPwd.value?.setCustomValidity(pwdInvalid ? "invalid" : "");
        regPwdCheck.value?.setCustomValidity(pwdCheckInvalid ? "invalid" : "");

        if (res) {
            message.value = "This E-Mail address is already registered";
            loading.value = false;
            return;
        }

        if (pwd.value != pwdCheck.value) {
            message.value = "The passwords don't match";
            loading.value = false;
            return;
        }  

        if (usernameInvalid || emailInvalid || pwdInvalid || pwdCheckInvalid) {
            message.value = "All fields have to be filled out";
            loading.value = false;
            return;
        }
        loading.value = false;
        loginPage.value = 3;
    });
}

async function proceedRegistering2() {
    loginPage.value = 4;
    minScale.value = 15*16;
    offsetX.value = 0
    selectorStyle.value = {
        left: 0,
        top: 4*16,
        width: 15*16,
        height: 6*16,
        radius: 8
    };
}

async function proceedRegistering3() {
    loading.value = true;
    let pass = await invoke("hash_from_password", {
        password: pwd.value
    });

    await createUser({
        Name: username.value,
        ProfilePicture: pfp.value,
        Hero: hero.value,
        Email: email.value,
        Password: pass
    } as User);

    loading.value = false;
    loginPage.value = 5;
}
</script>

<template>
    <Cropper :selector="selectorStyle" :offsetX="offsetX" :offsetY="offsetY" :minScale="minScale" :src="loginPage == 3 ? pfp : hero" :dim="dim" v-if="showCropper" @cancel="showCropper = false" @apply="d => { loginPage == 3 ? applyPfp(d) : applyHero(d) }"></Cropper>
    <div v-if="loading" class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    <div class="login">
            <div 
                v-if="loginPage == 1"
                class="login-page lp-1"
            >
                <h1>Login</h1>
                <span v-if="message.length > 0" class="warning">{{ message }}</span>
                <input ref="logEmail" v-model="email" type="text" placeholder="E-Mail">
                <input ref="logPwd" v-model="pwd" type="password" placeholder="Password">
                <Checkbox title="Remember Me" @check="v => remember = v"></Checkbox>
                <button @click="Login">Login</button>
                <a @click="loginPage = 2">I don't have an account yet.</a>
            </div>
            <div 
                v-else-if="loginPage == 2"
                class="login-page lp-2"
            >
                <h1>Register</h1>
                <span>Only your Username will be public.</span>

                <span v-if="message.length > 0" class="warning">{{ message }}</span>
                <input ref="regUsername" v-model="username" type="text" placeholder="Username">
                <input ref="regEmail" v-model="email" type="text" placeholder="E-Mail">
                <input ref="regPwd" v-model="pwd" type="password" placeholder="Password">
                <input ref="regPwdCheck" v-model="pwdCheck" type="password" placeholder="Repeat Password">
                <button @click="proceedRegistering">Continue <i class="chevron-right"></i></button>
                <a @click="loginPage = 1">I already have an account.</a>
            </div>
            <div 
                v-else-if="loginPage == 3"
                class="login-page lp-3"
            >
                <h1>Choose your Profile Picture</h1>
                <span>The first thing people see when you chat. Be considerate.</span>
                <img :src=pfp ref="displayPfp" alt="">
                <label for="pfp-upload" class="upload"><i class="cloud"></i>&nbsp;Upload</label>
                <input @change="onPfpChange" accept="image/jpeg" type="file" id="pfp-upload" hidden/>
                <button @click="proceedRegistering2">Continue <i class="chevron-right"></i></button>
                <a @click="loginPage = 1">I already have an account.</a>
            </div>
            <div 
                v-else-if="loginPage == 4"
                class="login-page lp-4"
            >
                <h1>Choose your Hero Image</h1>
                <span>This will be visible when people click on your profile</span>
                <div style="position: relative;">
                    <img class="hero" :src=hero ref="displayHero" alt="">
                    <img class="pfp" :src=pfp ref="displayPfp" alt="">
                </div>
                <label for="pfp-upload" class="upload"><i class="cloud"></i>&nbsp;Upload</label>
                <input @change="onHeroChange" accept="image/jpeg" type="file" id="pfp-upload" hidden/>
                <button @click="proceedRegistering3">Register</button>
                <a @click="loginPage = 1">I already have an account.</a>
            </div>
            <div 
                v-else-if="loginPage == 5"
                class="login-page"
            >
                <h1>Done!</h1>
                <span>You have succesfully registered.</span>
                <button @click="loginPage = 1">Login <i class="chevron-right"></i></button>
            </div>
        </div>
</template>

<style scoped>

.lp-4 .pfp {
    height: 7rem;
    width: 7rem;
    border-radius: 50%;
    margin-bottom: 1rem;
    position: absolute;
    left: 4rem;
    top: 2.5rem;
    background: var(--bg);
    border: .25rem solid var(--bg);
    box-sizing: border-box;
}

.lp-4 .hero {
    width: 15rem;
    height: 6rem;
    border-radius: .5rem;
    margin-bottom: 4.5rem;
}

.login-page {
    background: var(--bg);
    border-radius: 1.5rem;
    color: var(--text);
    padding: 3rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}
.login-page h1 {
    margin: 0;
}

.login-page span:not(.warning) {
    margin-bottom: 2rem;
    color: var(--secondary-text);
}

.login-page input {
    width: clamp(12rem, 30vw, 30rem);
    font-size: 1.2rem;
    height: 2.7rem;
    line-height: 1.2rem;
    border-radius: .5rem;
    border: 3px solid white;
    padding: .5rem .5rem;
    box-sizing: border-box;
    transition: border 300ms ease;
}

.login-page button {
    width: clamp(12rem, 30vw, 30rem);
    height: 2.7rem;
    font-size: 1.2rem;
    border-radius: .5rem;
    padding: .5rem .5rem;
    box-sizing: border-box;
    transition: border 300ms ease;
    background: #1982c4;
    transition: scale 150ms ease, background-color 300ms ease;
}

.login-page button i {
    font-size: .75em;
}

.login-page button:hover {
    background: #126091;
}

.login-page input:focus {
    outline: none;
    border: 3px solid #1982c4;
}

.login-page input:invalid {
    outline: none;
    border: 3px solid #ff595e;
}

.login-page label.upload {
    display: block;
    background: #1982c4;
    line-height: 1.4rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: clamp(12rem, 30vw, 30rem);
    height: 2.7rem;
    font-size: 1.2rem;
    border-radius: .5rem;
    cursor: pointer;
    transition: scale 150ms ease, background-color 300ms ease;
}

.login-page label.upload:hover {
    background: #126091;
}

.login-page label.upload i {
    font-size: 1.2em;
}

.login-page.lp-3 img {
    height: 7rem;
    width: 7rem;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.warning {
    color: #ff595e;
}
</style>