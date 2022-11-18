// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_MAL_HOST } from '../../../../lib/myanimelist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, status, score, chapter, volume, startDate, endDate, comment, tags } = req.body;

  const resp = await fetch(`${API_MAL_HOST}/v2/manga/${id}/my_list_status`, {
    headers: {
      Authorization: req.headers.authorization || '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: req.method,
    body: new URLSearchParams({
      status: status,
      score: score,
      num_volumes_read: volume,
      num_chapters_read: chapter,
      start_date: startDate,
      finish_date: endDate,
      comments: comment,
      tags: tags.join(),
    }),
  });

  const data = await resp.json();
  res.status(resp.status).json(data);
}
