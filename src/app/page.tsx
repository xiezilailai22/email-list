'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    const submitPromise = fetch('/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '提交失败');
      }
      setEmail('');
      return '订阅成功！';
    });

    toast.promise(submitPromise, {
      loading: '正在提交...',
      success: (message) => message,
      error: (err) => err.message,
    });

    try {
      await submitPromise;
    } catch {
      // 错误已经被 toast 处理
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-center" />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-center">
              邮件列表订阅
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              订阅我们的邮件列表以获取最新更新
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入您的邮箱地址"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  提交中...
                </span>
              ) : '订阅'}
            </Button>
          </form>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} 邮件列表. 保留所有权利.
            </p>
            <p className="text-xs text-muted-foreground">
              我们承诺保护您的隐私和个人信息
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
