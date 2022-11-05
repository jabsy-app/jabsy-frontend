import { getClient, Body, ResponseType } from "@tauri-apps/api/http";

export class User {
    ID = 0
    Name = ''
    Email = ''
    ProfilePicture = ''
    Hero = ''
    Status = ''
    PrivateKey = ''
    PublicKey = ''
    Password = ''
};

export async function createUser(user: User) {
    let client = await getClient();
    
    await client.post('http://localhost:7167/User/new', {
        payload: user,
        type: 'Json'
    });
};

export async function getUser(n: number) {
    let client = await getClient();
    
    let response = await client.get('http://localhost:7167/User', {
        headers: {
            id: n.toString()
        }
    });

    if (JSON.stringify(response.data).length == 2) {
        return null;
    }

    return response.data as User;
};

export async function getSalt(email: string) {
    let client = await getClient();
    
    let response = await client.get('http://localhost:7167/User/salt', {
        headers: {
            email
        },
        responseType: ResponseType.Text
    });

    if ((response.data as string).length == 0) {
        return null;
    }

    return response.data as User;
};

export async function emailExists(email: string) {
    let client = await getClient();
    
    let response = await client.get('http://localhost:7167/User/exists', {
        headers: {
            email
        }
    });

    return response.data;
};

export async function login(email: string, password: string) {
    let client = await getClient();
    
    let response = await client.get('http://localhost:7167/User/login', {
        headers: {
            email,
            password
        }
    });

    if (JSON.stringify(response.data).length == 2) {
        return null;
    }

    return response.data as User;
};