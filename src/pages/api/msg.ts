import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "./ws";
import { firestore } from "../chat";

export default async function Msg(req: NextApiRequest, res: NextApiResponseServerIO) {
  res.status(200).end()
};
