import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 使用连接池
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
  // 添加连接重试
  log: ['error', 'warn'],
});

// 健康检查函数
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: '该邮箱已经订阅过了' },
          { status: 400 }
        );
      }
      throw error; // 抛出其他错误
    }
  } catch (error: any) {
    console.error('Subscription error:', error);
    
    // 根据错误类型返回不同的错误信息
    if (error.message?.includes('connect')) {
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