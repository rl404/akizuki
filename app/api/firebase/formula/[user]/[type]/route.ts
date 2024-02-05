import admin from '@/src/utils/firebase';
import { DefaultFormula } from '@/src/utils/formula';

export type Data = string;

const database = admin.database();

export async function GET(_: Request, { params }: { params: { user: string; type: string } }) {
  const snapshot = await database.ref(`/formulas/${params.user}/${params.type}`).once(`value`);
  if (snapshot.exists()) return Response.json(snapshot.val());
  return Response.json(DefaultFormula);
}

export async function POST(request: Request, { params }: { params: { user: string; type: string } }) {
  const { formula } = await request.json();
  await database.ref(`/formulas/${params.user}/${params.type}`).set(formula);
  return Response.json(formula);
}
