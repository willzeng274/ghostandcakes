import httpProxyMiddleware from "next-http-proxy-middleware";
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    externalResolver: true,
  },
}

const handler = (req: NextApiRequest, res: NextApiResponse) => (
  httpProxyMiddleware(req, res, {
    target: process.env.NODE_ENV === "development" ? 'http://localhost:3334' : 'https://gnc-backend-production.up.railway.app/',
    pathRewrite: [{
      patternStr: '^/api/ws',
      replaceStr: '/socket.io/'
    }],
    ws: true
  })
);

export default handler;