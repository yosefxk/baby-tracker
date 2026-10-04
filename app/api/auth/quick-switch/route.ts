import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { readDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const db = readDb();
    const targetUser = db.users.find((u) => u.id === userId);

    if (!targetUser) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        is_system_admin: targetUser.is_system_admin,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, targetUser.id, {
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
