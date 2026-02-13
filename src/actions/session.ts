'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  });
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  redirect('/login');
}
