import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { SESSION_COOKIE_NAME, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'נא להזין שם משתמש וסיסמה' }, { status: 400 });
    }

    const db = readDb();
    const cleanUsername = username.toLowerCase().trim();
    const cleanPassword = password.trim();

    const user = db.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername &&
        verifyPassword(cleanPassword, u.password)
    );

    if (!user) {
      return NextResponse.json({ error: 'שם משתמש או סיסמה שגויים' }, { status: 401 });
    }

    // If password was stored in plaintext, upgrade it to hash on login
    if (!user.password.startsWith('pbkdf2$')) {
      user.password = hashPassword(cleanPassword);
      writeDb(db);
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        is_system_admin: user.is_system_admin,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, user.id, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'שגיאה בהתחברות' }, { status: 500 });
  }
}
