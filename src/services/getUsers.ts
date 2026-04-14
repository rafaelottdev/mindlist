import type { User } from "../types/User"

export async function getUsers(): Promise<User[]> {
    const response = await fetch("http://localhost:3000/users")
    const data = await response.json()

    return data
}
