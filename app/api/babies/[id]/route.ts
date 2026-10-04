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
    if (!canAccessBaby(user.id, id, 'manage')) {
      return NextResponse.json({ error: 'אין הרשאה לערוך ילד זה' }, { status: 403 });
    }

    const body = await req.json();
    const db = readDb();
    const babyIndex = db.babies.findIndex((b) => b.id === id);
    if (babyIndex === -1) {
      return NextResponse.json({ error: 'ילד לא נמצא' }, { status: 404 });
    }

    db.babies[babyIndex] = {
      ...db.babies[babyIndex],
      ...body,
      id, // protect id
      owner_user_id: db.babies[babyIndex].owner_user_id, // protect owner
    };

    writeDb(db);
    return NextResponse.json({ success: true, baby: db.babies[babyIndex] });
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
    const baby = db.babies.find((b) => b.id === id);
    if (!baby) {
      return NextResponse.json({ error: 'ילד לא נמצא' }, { status: 404 });
    }

    if (baby.owner_user_id !== user.id && !user.is_system_admin) {
      return NextResponse.json({ error: 'רק בעל היומן או מנהל יכולים למחוק ילד' }, { status: 403 });
    }

    db.babies = db.babies.filter((b) => b.id !== id);
    db.permissions = db.permissions.filter((p) => p.baby_id !== id);
    db.logs = db.logs.filter((l) => l.baby_id !== id);
    db.reminders = db.reminders.filter((r) => r.baby_id !== id);
    writeDb(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
