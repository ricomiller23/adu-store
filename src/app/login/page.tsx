'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4ee] text-[#16352a] text-sm font-semibold">
      Redirecting to dashboard...
    </div>
  );
}
