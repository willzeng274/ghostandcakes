import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.app_id as string,
  key: process.env.NEXT_PUBLIC_APP_KEY as string,
  secret: process.env.secret as string,
  cluster: process.env.NEXT_PUBLIC_CLUSTER as string,
  useTLS: true,
});

export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  const { message, sender } = req.body;
  await pusher.trigger("chat", "chat-event", {
    message,
    sender,
  });
  res.json({ message: "completed" });
}