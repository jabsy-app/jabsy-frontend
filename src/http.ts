import { invoke } from "@tauri-apps/api/tauri";

async function api_get(route: String): Promise<string> {
    return await invoke("get_from_url", { url: `https://localhost:7168/${route}` });
}

export default {
    api_get
}