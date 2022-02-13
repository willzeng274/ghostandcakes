import { NextApiRequest, NextApiResponse } from 'next'

export default function Email(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "POST") {
        res.status(404).end()
        return
    }
    if (req.body.email) {
        res.status(200).json({ message: req.body.email.endsWith(process.env.ONE) || req.body.email.endsWith(process.env.TWO) || req.body.email === "capitalismdiscordbot@gmail.com" })
        return
    } else {
        res.status(404).end()
        return
    }
}