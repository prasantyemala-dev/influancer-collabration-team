import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const threadId = searchParams.get('threadId');
  const toUserId = searchParams.get('toUserId');

  if (threadId) {
    // Get messages for a thread
    const messages = await prisma.message.findMany({
      where: { thread_id: threadId },
      orderBy: { created_at: 'asc' },
      include: { from_user: true },
    });
    return NextResponse.json(messages);
  }

  if (userId) {
    // Get threads for a user
    const threads = await prisma.thread.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: true,
      },
      orderBy: {
        last_updated: 'desc',
      },
    });
    return NextResponse.json(threads);
  }

  if (toUserId && userId) {
      // Find thread between two users (from "Message" button on profile)
      // This logic is duplicated in collab-request but useful for direct messaging
       const thread = await prisma.thread.findFirst({
        where: {
            AND: [
            { participants: { some: { id: userId } } },
            { participants: { some: { id: toUserId } } },
            ],
        },
       });
       if (thread) return NextResponse.json({ threadId: thread.id });

       // Create if not exists
       const newThread = await prisma.thread.create({
        data: {
          participants: {
            connect: [{ id: userId }, { id: toUserId }],
          },
          last_message_preview: 'Started a chat',
        },
      });
      return NextResponse.json({ threadId: newThread.id });
  }

  return NextResponse.json([]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = await prisma.message.create({
      data: {
        thread_id: body.thread_id,
        from_user_id: body.from_user_id,
        to_user_id: body.to_user_id,
        text: body.text,
      },
    });

    // Update thread
    await prisma.thread.update({
      where: { id: body.thread_id },
      data: {
        last_message_preview: body.text,
        last_updated: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
  }
}
