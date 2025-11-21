import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const posts = await prisma.post.findMany({
    include: {
      creator: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await prisma.post.create({
      data: {
        creator_id: body.creator_id,
        title: body.title,
        description: body.description,
        city: body.city,
        lat: body.lat,
        lng: body.lng,
        pay_amount: body.pay_amount,
        tags: body.tags,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}
