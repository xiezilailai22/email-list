import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as z from "zod"

const prisma = new PrismaClient()

const subscribeSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = subscribeSchema.parse(json)

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        email: body.email,
      },
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "该邮箱已经订阅" },
        { status: 400 }
      )
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: body.email,
      },
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "无效的邮箱地址" },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { error: "内部服务器错误" },
      { status: 500 }
    )
  }
} 