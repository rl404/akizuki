// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import firebase from '../../../../lib/firebase';
import { defaultFormula } from '../../../../lib/storage';

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
      if (firebase.apps.length === 0) {
        res.status(202).json(defaultFormula);
        return;
      }

      {
        const ref = firebase.database().ref(`formulas/${user}/${type}`);
        await ref.once(
          'value',
          (snapshot) => {
            if (snapshot.exists()) {
              res.status(200).json(snapshot.val());
              return;
            }

            res.status(200).json(defaultFormula);
          },
          (error) => {
            console.log(error.message);
            res.status(500).json('error get from db');
          },
        );
      }

      return;

    case 'POST':
      if (firebase.apps.length === 0) {
        res.status(202).end();
        return;
      }

      {
        const ref = firebase.database().ref(`formulas/${user}/${type}`);
        await ref.set(req.body.formula, (error) => {
          if (error) {
            console.log(error.message);
            res.status(500).json('error saving to db');
          } else {
            res.status(200).end();
          }
        });
      }

      return;

    default:
      res.status(405).end();
  }
}
