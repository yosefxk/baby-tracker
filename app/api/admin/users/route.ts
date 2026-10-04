import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';
import { User } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.is_system_admin) {
    return NextResponse.json({ error: 'גישה למנהל מערכת בלבד' }, { status: 403 });
  }

  const db = readDb();

  const userList = db.users.map((u) => {
    const ownedBabies = db.babies.filter((b) => b.owner_user_id === u.id);
    const userPermissions = db.permissions.filter((p) => p.user_id === u.id).map((p) => {
      const baby = db.babies.find((b) => b.id === p.baby_id);
      return {
        babyId: p.baby_id,
        babyName: baby?.name || 'לא ידוע',
        role: p.role,
      };
    });

    return {
      id: u.id,
      name: u.name,
      username: u.username,
      password: u.password,
      is_system_admin: u.is_system_admin,
      created_at: u.created_at,
      ownedBabies: ownedBabies.map((b) => ({ id: b.id, name: b.name })),
      permissions: userPermissions,
    };
  });

  return NextResponse.json({
    users: userList,
    totalBabies: db.babies.length,
    totalLogs: db.logs.length,
    totalInvitations: db.invitations.length,
  });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.is_system_admin) {
      return NextResponse.json({ error: 'גישה למנהל מערכת בלבד' }, { status: 403 });
    }

    const { action, userId, password, name, username, is_system_admin, babyId, role } = await req.json();
    const db = readDb();

    // Create new user directly from admin panel
    if (action === 'create_user') {
      if (!username || !password || !name) {
        return NextResponse.json({ error: 'נא למלא שם, שם משתמש וסיסמה' }, { status: 400 });
      }
      const cleanUsername = username.trim().toLowerCase();
      if (db.users.some((u) => u.username === cleanUsername)) {
        return NextResponse.json({ error: 'שם משתמש זה כבר תפוס' }, { status: 400 });
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        username: cleanUsername,
        name: name.trim(),
        password: password.trim(),
        is_system_admin: !!is_system_admin,
        created_at: new Date().toISOString(),
      };
      db.users.push(newUser);
      writeDb(db);
      return NextResponse.json({ success: true, user: newUser });
    }

    if (action === 'delete') {
      if (userId === user.id) {
        return NextResponse.json({ error: 'אינך יכול למחוק את עצמך' }, { status: 400 });
      }
      db.users = db.users.filter((u) => u.id !== userId);
      db.permissions = db.permissions.filter((p) => p.user_id !== userId);
      writeDb(db);
      return NextResponse.json({ success: true, message: 'המשתמש נמחק' });
    }

    if (action === 'update') {
      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
      }

      if (password) db.users[userIndex].password = password.trim();
      if (name) db.users[userIndex].name = name.trim();
      if (username) db.users[userIndex].username = username.trim().toLowerCase();
      if (typeof is_system_admin === 'boolean') {
        db.users[userIndex].is_system_admin = is_system_admin;
      }

      writeDb(db);
      return NextResponse.json({ success: true, user: db.users[userIndex] });
    }

    if (action === 'set_permission') {
      if (!babyId || !role) {
        return NextResponse.json({ error: 'חסרים נתונים לעדכון הרשאה' }, { status: 400 });
      }
      const existing = db.permissions.findIndex(
        (p) => p.user_id === userId && p.baby_id === babyId
      );
      if (existing >= 0) {
        db.permissions[existing].role = role;
      } else {
        db.permissions.push({
          id: `perm_${Date.now()}`,
          user_id: userId,
          baby_id: babyId,
          role,
          created_at: new Date().toISOString(),
        });
      }
      writeDb(db);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'פעולה לא חוקית' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
