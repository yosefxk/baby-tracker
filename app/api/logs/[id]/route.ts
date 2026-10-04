import { NextResponse } from 'next/server';
import { getCurrentUser, canAccessBaby } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { id } = await params;
    const db = readDb();
    const logIndex = db.logs.findIndex((l) => l.id === id);
    if (logIndex === -1) {
      return NextResponse.json({ error: 'רשומת יומן לא נמצאה' }, { status: 404 });
    }

    const log = db.logs[logIndex];
    if (!canAccessBaby(user.id, log.baby_id, 'log')) {
      return NextResponse.json({ error: 'אין הרשאה לערוך רשומה זו' }, { status: 403 });
    }

    const body = await req.json();
    db.logs[logIndex] = {
      ...log,
      ...body,
      id,
      baby_id: log.baby_id, // protect baby_id
    };

    writeDb(db);
    return NextResponse.json({ success: true, log: db.logs[logIndex] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { id } = await params;
    const db = readDb();
    const log = db.logs.find((l) => l.id === id);
    if (!log) {
      return NextResponse.json({ error: 'רשומת יומן לא נמצאה' }, { status: 404 });
    }

    if (!canAccessBaby(user.id, log.baby_id, 'log')) {
      return NextResponse.json({ error: 'אין הרשאה למחוק רשומה זו' }, { status: 403 });
    }

    db.logs = db.logs.filter((l) => l.id !== id);
    writeDb(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
