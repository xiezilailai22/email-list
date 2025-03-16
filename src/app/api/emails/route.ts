import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '无效的邮箱地址' },
        { status: 400 }
      );
    }

    try {
      const newSubscriber = await prisma.subscriber.create({
        data: { email },
      });
      return NextResponse.json(newSubscriber, { status: 201 });
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'P2002') {
        return NextResponse.json(
          { error: '该邮箱已经订阅过了' },
          { status: 400 }
        );
      }
      throw err;
    }
  } catch (err) {
    console.error('Subscription error:', err);
    
    if (err instanceof Error && err.message?.includes('connect')) {
      return NextResponse.json(
        { error: '服务暂时不可用，请稍后重试' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
} 