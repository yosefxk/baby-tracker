import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { User } from '@/lib/types';
import { SESSION_COOKIE_NAME, hashPassword } from '@/lib/auth';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    isSetupRequired: db.users.length === 0,
    hasUsers: db.users.length > 0,
    hasBabies: db.babies.length > 0,
  });
}

export async function POST(req: Request) {
  try {
    const db = readDb();
    if (db.users.length > 0) {
      return NextResponse.json({ error: 'מנהל מערכת כבר הוגדר' }, { status: 400 });
    }

    const { username, password, name } = await req.json();
    if (!username || !password || !name) {
      return NextResponse.json({ error: 'נא למלא שם, שם משתמש וסיסמה' }, { status: 400 });
    }

    const adminUser: User = {
      id: `user_admin_${Date.now()}`,
      username: username.trim().toLowerCase(),
      name: name.trim(),
      password: hashPassword(password.trim()),
      is_system_admin: true,
      created_at: new Date().toISOString(),
    };

    db.users.push(adminUser);
    writeDb(db);

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        name: adminUser.name,
        is_system_admin: true,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, adminUser.id, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
