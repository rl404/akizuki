// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_MAL_HOST } from '../../../../lib/myanimelist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, chapter, volume, completed, reading, todayStart, todayEnd } = req.body;

  var body = new URLSearchParams({
    num_chapters_read: chapter,
    num_volumes_read: volume,
  });

  const today = new Date();

  !!reading && body.set('status', 'reading');
  !!completed && body.set('status', 'completed');
  !!todayStart && body.set('start_date', today.toISOString().slice(0, 10));
  !!todayEnd && body.set('finish_date', today.toISOString().slice(0, 10));

  const resp = await fetch(`${API_MAL_HOST}/v2/manga/${id}/my_list_status`, {
    headers: {
      Authorization: req.headers.authorization || '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: req.method,
    body: body,
  });

  const data = await resp.json();
  res.status(resp.status).json(data);
}
