import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return NextResponse.json(user ? [user] : []);
  }

  if (id) {
     const user = await prisma.user.findUnique({
      where: { id },
    });
    return NextResponse.json(user);
  }

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        bio: body.bio,
        category_tags: body.category_tags,
        city: body.city,
        lat: body.lat || 0,
        lng: body.lng || 0,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const user = await prisma.user.update({
      where: { id },
      data: data,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}
