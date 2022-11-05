import { readTextFile, writeTextFile, removeFile } from '@tauri-apps/api/fs';
import { configDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { createStore } from 'vuex'
import { delay } from './helpers';
import { getUser, User, emailExists } from './models/user';

const storeFile = await configDir() + "store.json"

export default createStore({
    state: {
        thisUser: User,
        users: [] as User[],
        block: false,
    },
    mutations: {
        addUser(state, user: User) {
            state.users.push(user);
        },
        clearUsers(state) {
            state.users = [];
        },
        blockIndex(state) {
            state.block = true
        },
        unblockIndex(state) {
            state.block = false
        }
    },
    actions: {
        async getUser(context, id) {
            while (context.getters.isBlocked) {
                await delay(100);
            }
            context.commit('blockIndex');
            let user;
            context.getters.users.forEach((lcluser: User) => {
                if (lcluser.ID == id) {
                    user = lcluser;
                }
            });
            if (user) {
                context.commit('unblockIndex');
                
                return user;
            }
            user = await getUser(id);

            if (user != null) {
                context.commit("addUser", user);
            }

            context.commit('unblockIndex');
            return user ?? null;
        },
        async store(context, data: {name: string, value: any}) {
            let currentStore = JSON.parse(await invoke('get_file', {
                path: storeFile,
                default: '{}'
            }));
            currentStore[data.name] = data.value;
            await invoke('write_file', {
                path: storeFile,
                value: JSON.stringify(currentStore)
            });
        },
        async getStore(context, name) {
            let currentStore = JSON.parse(await invoke('get_file', {
                path: storeFile,
                default: '{}'
            }));
            return currentStore[name];
        }
    },
    getters: {
        users(state) {
            return state.users
        },
        isBlocked(state) {
            return state.block
        }
    }
});