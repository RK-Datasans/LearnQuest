import { cookies } from 'next/headers';
import crypto from 'crypto';
import { query, execute } from './db';
import { User } from './types';

const SESSION_COOKIE_NAME = 'learnquest_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'learnquest_ai_super_secret_session_key_2026_x!';

export interface SessionData {
  userId: number;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  name: string;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(user: { id: number; email: string; role: 'student' | 'faculty' | 'admin'; name: string }): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  try {
    await execute(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );
  } catch (err) {
    console.error('Session DB write failed, fallback to stateless cookie:', err);
  }

  // Set HTTP-only cookie
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const rows = await query<any>(
      `SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role, u.avatar_url 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.token = ? AND s.expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      userId: row.id,
      email: row.email,
      role: row.role,
      name: row.name,
    };
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await execute('DELETE FROM sessions WHERE token = ?', [token]);
    } catch (e) {
      console.warn('Failed to delete session token from DB', e);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
