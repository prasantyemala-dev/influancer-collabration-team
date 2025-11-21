import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Create CollabRequest
    const collabRequest = await prisma.collabRequest.create({
      data: {
        from_user_id: body.from_user_id,
        to_user_id: body.to_user_id,
        post_id: body.post_id,
        message: body.message,
        proposed_date: body.proposed_date ? new Date(body.proposed_date) : null,
      },
    });

    // 2. Create/Find Thread
    // Check if thread exists
    let thread = await prisma.thread.findFirst({
      where: {
        AND: [
          { participants: { some: { id: body.from_user_id } } },
          { participants: { some: { id: body.to_user_id } } },
        ],
      },
    });

    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          participants: {
            connect: [{ id: body.from_user_id }, { id: body.to_user_id }],
          },
          last_message_preview: body.message,
        },
      });
    } else {
       await prisma.thread.update({
        where: { id: thread.id },
        data: { last_message_preview: body.message, last_updated: new Date() }
       });
    }

    // 3. Send Initial Message
    await prisma.message.create({
      data: {
        thread_id: thread.id,
        from_user_id: body.from_user_id,
        to_user_id: body.to_user_id,
        text: `[Collab Request] ${body.message}`,
      },
    });

    return NextResponse.json(collabRequest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error sending request' }, { status: 500 });
  }
}
