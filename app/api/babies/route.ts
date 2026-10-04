import { NextResponse } from 'next/server';
import { getCurrentUser, getUserAccessibleBabies } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';
import { Baby, BabyPermission } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const babies = getUserAccessibleBabies(user.id);
  return NextResponse.json({ babies });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { name, gender, birth_date, due_date, photo_url, notes } = await req.json();
    if (!name || !gender || !birth_date) {
      return NextResponse.json({ error: 'נא למלא שם, מין ותאריך לידה' }, { status: 400 });
    }

    const db = readDb();
    const newBabyId = `baby_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newBaby: Baby = {
      id: newBabyId,
      owner_user_id: user.id,
      name: name.trim(),
      gender: gender === 'boy' ? 'boy' : 'girl',
      birth_date,
      due_date: due_date || undefined,
      photo_url: photo_url || undefined,
      notes: notes || undefined,
      created_at: now,
    };

    const newPerm: BabyPermission = {
      id: `perm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      baby_id: newBabyId,
      user_id: user.id,
      role: 'parent',
      created_at: now,
    };

    db.babies.push(newBaby);
    db.permissions.push(newPerm);
    writeDb(db);

    return NextResponse.json({ success: true, baby: newBaby });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
