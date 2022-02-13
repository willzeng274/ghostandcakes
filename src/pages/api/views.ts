import type { NextApiRequest, NextApiResponse } from 'next'
import db, { Fetch } from '../../helpers/deta';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json( { message: "Not yet implemented" });
  return
  if (req.method === "POST") {
    try {
      if (!req.body.name || !req.body.points) {
        res.status(404).json({ message: "Missing required argument" });
        return;
      }
      let items: {}[] = await Fetch();
      items = items.sort((a, b) => -(a as any).points + (b as any).points)
      if (items.length > 9) {
        if ((items[items.length-1] as any).points >= req.body?.points) {
          res.status(404).json({ message: "Invalid Contestant" })
          return;
        }
        await db.delete((items[items.length-1] as any).key);
      }
      await db.put({
        points: req.body?.points
      }, req.body?.name);
      res.status(204);
      return;
    } catch (err) {
      console.log(err);
    }
  } else if (req.method === "OPTIONS") {
    // res.setHeader("Access-Control-Allow-Origin", "*").status(200);
    // return;
    res.status(200).json({ message: "OK" });
    return;
  } else {
    res.status(404).send("No");
    return
  }
}

// export const config = {
//   api: {
//     bodyParser: true
//   }
// }