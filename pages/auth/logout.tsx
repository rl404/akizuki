import { useRouter } from 'next/router';
import * as React from 'react';

export default function Logout() {
  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;
    localStorage.clear();
    router.push('/auth/login');
  }, [router]);

  return 'logging out...';
}
