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
        const user: any = jwt.verify(req.headers.authorization, process.env.SECRET_JWT as string);
        if (req.method === "POST") {
            if (req.body.name) {
                await prisma.guild.create({
                    data: {
                        ownerId: Number(user.id),
                        name: req.body.name,
                    }
                });
                res.status(205).end();
            } else {
                res.status(400).json({
                    message: "Message invalid."
                });
            }
        } else if (req.method === "GET") {

        } else {
            res.status(405).json({message: "Method not allowed."})
        }
    } catch (err: any) {
        res.status(400).json({
            message: err.message
        });
    }
}