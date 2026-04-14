import type { User } from "../types/User"

export async function createUser(user: User) {
    const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    const data = await response.json()

    return data
}
