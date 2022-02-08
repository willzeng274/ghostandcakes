import { Deta } from 'deta'
import j from '../deta.json'

export const deta = Deta(j.ProjectKey)
const db = deta.Base("gnc")

export default db;

export async function Fetch(): Promise<Array<{}>> {
    return (await db.fetch({})).items;
}