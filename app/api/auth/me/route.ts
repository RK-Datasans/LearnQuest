import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }
    if (session.role === 'student') {
      const profile = await getStudentProfileByUserId(session.userId);
      return NextResponse.json({ session, profile });
    }
    // Faculty user
    const users = await query<any>('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [session.userId]);
    return NextResponse.json({ session, profile: users[0] || null });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Failed to fetch session.' }, { status: 500 });
  }
}
