import { Deta } from 'deta'

export const deta = Deta(process.env.PROJECT_KEY)
const db = deta.Base("gnc")

export default db;

export async function Fetch(): Promise<Array<{}>> {
    return (await db.fetch({})).items;
}