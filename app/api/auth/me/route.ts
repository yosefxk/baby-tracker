import { NextResponse } from 'next/server';
import { getCurrentUser, getUserAccessibleBabies } from '@/lib/auth';
import { readDb } from '@/lib/db';

export async function GET() {
  const db = readDb();

  // If no users exist in the database, setup is required
  if (db.users.length === 0) {
    return NextResponse.json({
      isSetupRequired: true,
      user: null,
      babies: [],
      allUsers: [],
    });
  }

  let user = await getCurrentUser();

  // If no session cookie, check if there's only 1 user (auto-session for local ease) or require login
  if (!user && db.users.length === 1) {
    user = db.users[0];
  }

  if (!user) {
    return NextResponse.json({
      isSetupRequired: false,
      user: null,
      babies: [],
      allUsers: db.users.map((u) => ({ id: u.id, name: u.name, username: u.username, is_system_admin: u.is_system_admin })),
    }, { status: 401 });
  }

  const babies = getUserAccessibleBabies(user.id);
  const allUsers = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    is_system_admin: u.is_system_admin,
  }));

  return NextResponse.json({
    isSetupRequired: false,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      is_system_admin: user.is_system_admin,
    },
    babies,
    allUsers,
  });
}
