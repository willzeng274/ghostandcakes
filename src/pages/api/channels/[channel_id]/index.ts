import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(404).json({
        message: "Wrong Endpoint My Guy."
    });
}