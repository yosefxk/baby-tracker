import { NextResponse } from 'next/server';
import { getCurrentUser, SESSION_COOKIE_NAME, verifyPassword, hashPassword } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';
import { BabyPermission, User } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { code, name, username, password, babyName, babyGender, babyBirthDate, babyNotes } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'חסר קוד הזמנה' }, { status: 400 });
    }

    const db = readDb();
    const invitationIndex = db.invitations.findIndex((inv) => inv.code === code);
    if (invitationIndex === -1) {
      return NextResponse.json({ error: 'קישור ההזמנה אינו תקף' }, { status: 404 });
    }

    const invitation = db.invitations[invitationIndex];
    if (invitation.used_count >= invitation.max_uses) {
      return NextResponse.json({ error: 'קישור הזמנה זה כבר נוצל' }, { status: 410 });
    }

    let user = await getCurrentUser();

    // If user is not logged in, either authenticate existing by username/password or create new user
    if (!user) {
      if (!name || !username || !password) {
        return NextResponse.json({ error: 'נא להזין שם, שם משתמש וסיסמה' }, { status: 400 });
      }

      const cleanUsername = username.trim().toLowerCase();
      let existingUser = db.users.find((u) => u.username === cleanUsername);

      if (existingUser) {
        if (!verifyPassword(password.trim(), existingUser.password)) {
          return NextResponse.json({ error: 'שם משתמש זה כבר קיים עם סיסמה אחרת' }, { status: 400 });
        }
        user = existingUser;
      } else {
        const newUser: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          username: cleanUsername,
          name: name.trim(),
          password: hashPassword(password.trim()),
          is_system_admin: false,
          created_at: new Date().toISOString(),
        };
        db.users.push(newUser);
        user = newUser;
      }
    }

    // If recipient provided their own baby details, create their baby!
    if (babyName && babyName.trim()) {
      const newBabyId = `baby_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newBaby = {
        id: newBabyId,
        owner_user_id: user.id,
        name: babyName.trim(),
        gender: (babyGender === 'boy' ? 'boy' : 'girl') as 'boy' | 'girl',
        birth_date: babyBirthDate || new Date().toISOString().split('T')[0],
        notes: babyNotes?.trim() || undefined,
        created_at: new Date().toISOString(),
      };
      db.babies.push(newBaby);
      db.permissions.push({
        id: `perm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        baby_id: newBabyId,
        user_id: user.id,
        role: 'parent',
        created_at: new Date().toISOString(),
      });
    }

    // Determine target baby IDs from the inviter (if any)
    let targetBabyIds: string[] = [];
    if (invitation.target_baby_ids.includes('*')) {
      targetBabyIds = db.babies
        .filter((b) => b.owner_user_id === invitation.created_by_user_id)
        .map((b) => b.id);
    } else {
      targetBabyIds = invitation.target_baby_ids.filter((id) => id !== '*');
    }

    // Assign permissions for each target baby
    for (const babyId of targetBabyIds) {
      const existingPermIndex = db.permissions.findIndex(
        (p) => p.baby_id === babyId && p.user_id === user!.id
      );

      if (existingPermIndex >= 0) {
        db.permissions[existingPermIndex].role = invitation.target_role;
      } else {
        const newPerm: BabyPermission = {
          id: `perm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          baby_id: babyId,
          user_id: user!.id,
          role: invitation.target_role,
          created_at: new Date().toISOString(),
        };
        db.permissions.push(newPerm);
      }
    }

    // Increment invitation usage
    invitation.used_count += 1;
    writeDb(db);

    const response = NextResponse.json({
      success: true,
      message: 'ההזמנה התקבלה בהצלחה!',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
