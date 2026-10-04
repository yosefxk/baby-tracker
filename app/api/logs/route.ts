import { NextResponse } from 'next/server';
import { getCurrentUser, canAccessBaby } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';
import { LogEntry } from '@/lib/types';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const babyId = searchParams.get('babyId');
  if (!babyId) {
    return NextResponse.json({ error: 'נא לציין מזהה תינוק' }, { status: 400 });
  }

  if (!canAccessBaby(user.id, babyId, 'view')) {
    return NextResponse.json({ error: 'אין הרשאת צפייה לתינוק זה' }, { status: 403 });
  }

  const db = readDb();
  const logs = db.logs
    .filter((l) => l.baby_id === babyId)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  return NextResponse.json({ logs });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { baby_id, type, start_time, end_time, details, notes } = await req.json();
    if (!baby_id || !type) {
      return NextResponse.json({ error: 'חסרים נתונים חובה' }, { status: 400 });
    }

    if (!canAccessBaby(user.id, baby_id, 'log')) {
      return NextResponse.json({ error: 'אין הרשאה לתעד עבור תינוק זה' }, { status: 403 });
    }

    const db = readDb();
    const newLog: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      baby_id,
      user_id: user.id,
      user_name: user.name,
      type,
      start_time: start_time || new Date().toISOString(),
      end_time: end_time || undefined,
      details: details || {},
      notes: notes || undefined,
      created_at: new Date().toISOString(),
    };

    db.logs.push(newLog);
    writeDb(db);

    return NextResponse.json({ success: true, log: newLog });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
