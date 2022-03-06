import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"

export default function Get(req: NextApiRequest, res: NextApiResponse) {
    if (!req.headers.authorization) {
        res.status(400).json({
            message: "Bad Request. No authorization header provided"
        });
        return;
    }
    try {
        const result = jwt.verify(req.headers.authorization, process.env.SECRET_JWT as string);
        res.status(200).json(result);
    } catch {
        res.status(400).json({
            message: "Not Authenticated"
        });
    }
}