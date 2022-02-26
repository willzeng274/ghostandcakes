// import NextAuth from "next-auth"
// // import GithubProvider from "next-auth/providers/github"
// // import EmailProvider from "next-auth/providers/email"

import { NextApiRequest, NextApiResponse } from "next";

// export default NextAuth({
//   providers: [
//     // GithubProvider({
//     //   clientId: process.env.GITHUB_ID,
//     //   clientSecret: process.env.GITHUB_SECRET,
//     // }),
//     // EmailProvider({
//     //   server: {
//     //     host: process.env.EMAIL_SERVER_HOST,
//     //     port: process.env.EMAIL_SERVER_PORT,
//     //     auth: {
//     //       user: process.env.EMAIL_SERVER_USER,
//     //       pass: process.env.EMAIL_SERVER_PASSWORD
//     //     }
//     //   },
//     //   from: process.env.EMAIL_FROM
//     // }),
//   ],
//   // secret: process.env.NEXTAUTH_SECRET
// })

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).end()
}