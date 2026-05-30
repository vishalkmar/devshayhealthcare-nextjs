import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
export const AUTH_COOKIE = 'devrishi_admin';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Read the admin from the request cookie. Returns the decoded payload or null.
export function getAdminFromCookies() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Guard for API route handlers. Returns { admin } when authed, otherwise a
// 401 NextResponse the caller should return immediately.
export function requireAdmin() {
  const admin = getAdminFromCookies();
  if (!admin) {
    return { admin: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  return { admin, error: null };
}

export function setAuthCookie(token) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}
