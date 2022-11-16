// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ref, set, get, child } from 'firebase/database';
import { firebaseDB } from '../../../../lib/firebase';

export type Data = string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { userType } = req.query;

  if (!userType || userType.length != 2) {
    res.status(404).end();
    return;
  }

  const user = userType[0];
  const type = userType[1];

  switch (req.method) {
    case 'GET':
      var f = await get(child(ref(firebaseDB), `formulas/${user}/${type}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          }
        })
        .catch((error) => {
          console.log(error);
        });

      res.status(200).json(f);
      return;
    case 'POST':
      const { formula } = req.body;

      await set(ref(firebaseDB, `formulas/${user}/${type}`), formula).catch((error) => {
        console.log(error);
      });

      res.status(200).json(f);
      return;
    default:
      res.status(405).end();
  }
}
