import { Deta } from 'deta'

export const deta = Deta(process.env.NEXT_PUBLIC_PROJECT_KEY)
const db = deta.Base("gnc")

export default db;

export async function Fetch(): Promise<Array<{}>> {
    return (await db.fetch({})).items;
}