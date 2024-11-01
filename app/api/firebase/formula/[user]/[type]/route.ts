import admin from '@/src/utils/firebase';
import { DefaultFormula } from '@/src/utils/formula';

export type Data = string;

export async function GET(_: Request, { params }: { params: Promise<{ user: string; type: string }> }) {
  try {
    const { user, type } = await params;
    const database = admin.database();
    const snapshot = await database.ref(`/formulas/${user}/${type}`).once(`value`);
    if (snapshot.exists()) return Response.json(snapshot.val());
    return Response.json(DefaultFormula);
  } catch (err) {
    return Response.json(DefaultFormula);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ user: string; type: string }> }) {
  try {
    const { user, type } = await params;
    const { formula } = await request.json();
    const database = admin.database();
    await database.ref(`/formulas/${user}/${type}`).set(formula);
    return Response.json(formula);
  } catch (err) {
    return Response.json(DefaultFormula);
  }
}
