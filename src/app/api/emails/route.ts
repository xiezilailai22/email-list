import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 使用连接池
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
  log: ['error'],
});

// 预热连接
prisma.$connect().catch(console.error);

// 健康检查函数
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '无效的邮箱地址' },
        { status: 400 }
      );
    }

    // 检查连接状态
    const isConnected = await checkConnection();
    if (!isConnected) {
      // 如果连接断开，尝试重新连接
      await prisma.$connect();
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