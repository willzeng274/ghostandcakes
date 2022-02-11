import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "./ws";
import { firestore } from "../chat";

export default async function Msg(req: NextApiRequest, res: NextApiResponseServerIO) {
  const messagesRef = firestore.collection('messages');
  const now = Date.now();
  const cutoff = now/1000 - 1 * 24 * 60 * 60;
  const old = await messagesRef.orderBy('createdAt').get();
  const deleted = old.docs.map((doc: any) => { return {data: doc.data(), id: doc.id} }).filter((doc: any) => doc.data.createdAt.seconds < cutoff);
  deleted.forEach((item: any) => {
    messagesRef.doc(item.id).delete().then(() => {
    })
  })
  res.status(200).end()
};
