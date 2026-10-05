import { cookies } from 'next/headers';
import crypto from 'crypto';
import { readDb } from './db';
import { User, Role } from './types';

export const SESSION_COOKIE_NAME = 'baby_session_user_id';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `pbkdf2$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored?: string): boolean {
  if (!stored) return false;
  if (!stored.startsWith('pbkdf2$')) {
    // Legacy plaintext backwards compatibility
    return stored === password;
  }
  const parts = stored.split('$');
  if (parts.length !== 3) return false;
  const [, salt, hash] = parts;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!userId) return null;

  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  return user || null;
}

export function getUserAccessibleBabies(userId: string) {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return [];

  // System admin sees all babies
  if (user.is_system_admin) {
    return db.babies.map((b) => ({
      ...b,
      role: 'parent' as Role,
      isOwner: b.owner_user_id === user.id,
    }));
  }

  // Owned babies
  const ownedBabies = db.babies
    .filter((b) => b.owner_user_id === userId)
    .map((b) => ({
      ...b,
      role: 'parent' as Role,
      isOwner: true,
    }));

  // Granted permissions
  const permittedBabies = db.permissions
    .filter((p) => p.user_id === userId)
    .map((p) => {
      const baby = db.babies.find((b) => b.id === p.baby_id);
      if (!baby) return null;
      return {
        ...baby,
        role: p.role,
        isOwner: baby.owner_user_id === userId,
      };
    })
    .filter(Boolean) as (typeof ownedBabies[0])[];

  // Merge and dedup
  const babyMap = new Map<string, typeof ownedBabies[0]>();
  for (const b of [...ownedBabies, ...permittedBabies]) {
    if (!babyMap.has(b.id) || b.role === 'parent') {
      babyMap.set(b.id, b);
    }
  }

  return Array.from(babyMap.values());
}

export function canAccessBaby(userId: string, babyId: string, requiredRole: 'view' | 'log' | 'manage' = 'view'): boolean {
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return false;
  if (user.is_system_admin) return true;

  const baby = db.babies.find((b) => b.id === babyId);
  if (!baby) return false;
  if (baby.owner_user_id === userId) return true;

  const perm = db.permissions.find((p) => p.baby_id === babyId && p.user_id === userId);
  if (!perm) return false;

  if (requiredRole === 'manage') {
    return perm.role === 'parent';
  }
  if (requiredRole === 'log') {
    return perm.role === 'parent' || perm.role === 'caregiver';
  }
  return true; // view
}
