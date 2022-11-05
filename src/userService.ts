import { urlToHttpOptions } from "url";
import { getUser, User } from "./models/user"

export default class UserService {
    users: User[] = []

    async get(id: number) {
        console.log(`Requested User: ${id}`);

        for (let i = 0; i < this.users.length; ++i) {
            console.log(`${this.users[i].ID};${id};${this.users[i].ID === id}`)
            if (this.users[i].ID === id) {
                return this.users[i];
            }
        }

        console.log(`Getting new User from API: ${id}`);

        let user = await getUser(id);

        if (user) this.users.push(user);

        return user;
    }

    clearCache() {
        this.users = [];
    }
}