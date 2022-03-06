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
        jwt.verify(req.headers.authorization, process.env.SECRET_JWT as string);
        if (req.method === "POST") {
            if (req.body.name) {
                const { guild_id } = req.query;
                const data = await prisma.channel.findMany({
                    where: {
                        guildId: Number(guild_id),
                    },
                    select: {
                        position: true
                    },
                    orderBy: {
                        position: "desc"
                    },
                    take: 1
                });
                await prisma.channel.create({
                    data: {
                        guildId: Number(guild_id),
                        name: req.body.name,
                        position: data[0].position+1
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