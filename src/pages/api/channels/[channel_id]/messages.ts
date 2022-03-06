import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Get(req: NextApiRequest, res: NextApiResponse) {
    if (!req.headers.authorization) {
        res.status(400).json({
            message: "Bad Request. No authorization header provided"
        });
        return;
    }
    try {
        const result: any = jwt.verify(req.headers.authorization, process.env.SECRET_JWT as string);
        if (req.method === "POST") {
            if (req.body.message && req.body.message.content) {
                const { channel_id } = req.query;
                await prisma.message.create({
                    data: {
                        channelId: Number(channel_id),
                        authorId: result.id,
                        content: req.body.message.content,
                        referenceId: req.body.message.referenceId ? req.body.message.referenceId : null
                    }
                });
                res.status(205).end();
            } else {
                res.status(400).json({
                    message: "Message invalid."
                })
            }
        } else if (req.method === "GET") {

        } else {
            res.status(405).json({message: "Method not allowed."})
        }
    } catch (err: any) {
        console.log(err);
        console.log(err.message);
        res.status(400).json({
            message: err.message
        });
    }
}