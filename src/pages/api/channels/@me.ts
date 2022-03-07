import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client';

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
        const user = await prisma.user.findUnique({
            where: {
                id: result.id
            },
            select: {
                username: true,
                posts: true,
                guilds: true,
                id: true,
                email: true,
                avatarUrl: true,
                bio: true,
                friends: true,
                archived: true,
            }
        })
        res.status(200).json(user);
    } catch {
        res.status(400).json({
            message: "Not Authenticated"
        });
    }
}