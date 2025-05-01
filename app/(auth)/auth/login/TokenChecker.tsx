'use client';

import { getAccessToken } from '@/src/utils/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TokenChecker() {
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) router.push('/');
  }, [router]);

  return <></>;
}
