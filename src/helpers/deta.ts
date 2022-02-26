import { Deta } from 'deta'

export const deta = Deta(process.env.NEXT_PUBLIC_PROJECT_KEY)
const db = deta.Base("gnc")
export const messages = deta.Base("messages")
export const channels = deta.Base("channels")
export const guilds = deta.Base("guilds")
export const users = deta.Base("users")

export default db;

export async function Fetch(): Promise<Array<{}>> {
    return (await db.fetch({})).items;
}