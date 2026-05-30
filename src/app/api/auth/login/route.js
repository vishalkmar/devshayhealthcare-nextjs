import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    const admin = await prisma.admin.findUnique({ where: { email: String(email).toLowerCase().trim() } });
    if (!admin) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
    setAuthCookie(token);
    return NextResponse.json({ data: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
