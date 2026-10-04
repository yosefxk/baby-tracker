import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';
import { Invitation } from '@/lib/types';
import crypto from 'crypto';

function getAppBaseUrl(req: Request): string {
  const envUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = forwardedHost || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  if (host) return `${proto}://${host}`;
  return '';
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }

  const db = readDb();
  // Return invitations created by this user or all if admin
  const invitations = db.invitations.filter(
    (inv) => inv.created_by_user_id === user.id || user.is_system_admin
  );

  return NextResponse.json({ invitations, baseUrl: getAppBaseUrl(req) });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
    }

    const { target_role, target_baby_ids, label, max_uses, invite_type, allow_create_baby } = await req.json();
    const type = invite_type || (target_baby_ids && target_baby_ids.length > 0 ? 'co_parent' : 'new_user');
    const role = target_role || 'parent';
    const babyIds = target_baby_ids || [];

    if (type === 'co_parent' && babyIds.length === 0) {
      return NextResponse.json({ error: 'נא לבחור ילדים לשיתוף' }, { status: 400 });
    }

    const db = readDb();
    // Generate clean, readable 8-character invite code
    const code = crypto.randomBytes(4).toString('hex');
    const now = new Date().toISOString();

    const newInvitation: Invitation = {
      id: `inv_${Date.now()}_${code}`,
      code,
      created_by_user_id: user.id,
      created_by_name: user.name,
      target_role: role as any,
      target_baby_ids: babyIds,
      invite_type: type,
      allow_create_baby: allow_create_baby ?? true,
      label: label?.trim() || undefined,
      max_uses: max_uses || 5,
      used_count: 0,
      created_at: now,
    };

    db.invitations.push(newInvitation);
    writeDb(db);

    const baseUrl = getAppBaseUrl(req);
    const inviteUrl = `/invite/${code}`;
    const fullUrl = baseUrl ? `${baseUrl}${inviteUrl}` : inviteUrl;

    return NextResponse.json({
      success: true,
      invitation: newInvitation,
      inviteUrl,
      fullUrl,
      baseUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
