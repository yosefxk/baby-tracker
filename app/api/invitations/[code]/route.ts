import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const db = readDb();
  const invitation = db.invitations.find((inv) => inv.code === code);

  if (!invitation) {
    return NextResponse.json({ error: 'קישור ההזמנה אינו תקף או פג תוקף' }, { status: 404 });
  }

  if (invitation.used_count >= invitation.max_uses) {
    return NextResponse.json({ error: 'קישור הזמנה זה כבר נוצל' }, { status: 410 });
  }

  // Resolve target baby names
  let targetBabies: { id: string; name: string }[] = [];
  if (invitation.target_baby_ids.includes('*')) {
    targetBabies = db.babies
      .filter((b) => b.owner_user_id === invitation.created_by_user_id)
      .map((b) => ({ id: b.id, name: b.name }));
  } else {
    targetBabies = db.babies
      .filter((b) => invitation.target_baby_ids.includes(b.id))
      .map((b) => ({ id: b.id, name: b.name }));
  }

  return NextResponse.json({
    invitation: {
      code: invitation.code,
      created_by_name: invitation.created_by_name,
      target_role: invitation.target_role,
      label: invitation.label,
      targetBabies,
      allow_create_baby: invitation.allow_create_baby ?? true,
      invite_type: invitation.invite_type || (targetBabies.length > 0 ? 'co_parent' : 'new_user'),
      created_at: invitation.created_at,
    },
  });
}
