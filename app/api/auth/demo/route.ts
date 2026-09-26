import { NextRequest, NextResponse } from 'next/server';
import { quickDemoLogin } from '@/lib/auth';
import { z } from 'zod';

const DemoSchema = z.object({
  role: z.enum(['student', 'faculty', 'mba']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = DemoSchema.parse(body);
    const user = await quickDemoLogin(role);
    if (!user) {
      return NextResponse.json({ error: 'Demo login failed.' }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Demo login failed.' }, { status: 500 });
  }
}
