import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "./ws";
import { firestore } from "../chat";

export default async function Msg(req: NextApiRequest, res: NextApiResponseServerIO) {
  const messagesRef = firestore.collection('messages');
  const now = Date.now();
  const cutoff = now/1000 - 3 * 24 * 60 * 60;
  const old = await messagesRef.orderBy('createdAt').get();
  const deleted = old.docs.map((doc: any) => doc.data()).filter((doc: any) => doc.createdAt.seconds < cutoff);
  deleted.forEach((item: any) => {
    messagesRef.doc(item.uid).delete().catch((er: Error) => {console.log(er)})
  })
  res.status(200).end()
};
