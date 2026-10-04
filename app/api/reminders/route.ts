import { NextResponse } from 'next/server';
import { getCurrentUser, canAccessBaby } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';
import { Reminder } from '@/lib/types';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const babyId = searchParams.get('babyId');
  if (!babyId) {
    return NextResponse.json({ error: 'חסר מזהה תינוק' }, { status: 400 });
  }

  const db = readDb();
  const reminders = db.reminders.filter((r) => r.baby_id === babyId);
  return NextResponse.json({ reminders });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { baby_id, title, time, type, notes } = await req.json();
    if (!baby_id || !title || !time) {
      return NextResponse.json({ error: 'נא למלא כותרת ושעה' }, { status: 400 });
    }

    if (!canAccessBaby(user.id, baby_id, 'log')) {
      return NextResponse.json({ error: 'אין הרשאה לערוך תזכורות לתינוק זה' }, { status: 403 });
    }

    const db = readDb();
    const newReminder: Reminder = {
      id: `rem_${Date.now()}`,
      baby_id,
      title,
      time,
      type: type || 'custom',
      is_active: true,
      notes,
    };

    db.reminders.push(newReminder);
    writeDb(db);

    return NextResponse.json({ success: true, reminder: newReminder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { id, is_active } = await req.json();
    const db = readDb();
    const reminder = db.reminders.find((r) => r.id === id);
    if (!reminder) {
      return NextResponse.json({ error: 'תזכורת לא נמצאה' }, { status: 404 });
    }

    reminder.is_active = is_active;
    writeDb(db);

    return NextResponse.json({ success: true, reminder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
