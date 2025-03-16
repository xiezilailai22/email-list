import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '无效的邮箱地址' },
        { status: 400 }
      );
    }

    const newSubscriber = await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json(newSubscriber, { status: 201 });
  } catch (error: any) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '该邮箱已经存在' },
        { status: 400 }
      );
    }

    // 检查是否是连接错误
    if (error.message?.includes('connect')) {
      return NextResponse.json(
        { error: '数据库连接失败' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
} 