import { SubscribeForm } from "@/components/subscribe-form"

export default function Home() {
  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            订阅我们的邮件列表
          </h1>
          <p className="text-sm text-muted-foreground">
            输入您的邮箱地址以接收最新更新
          </p>
        </div>
        <SubscribeForm />
      </div>
    </div>
  )
}
