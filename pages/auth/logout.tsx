import { useRouter } from 'next/router';
import * as React from 'react';

export default function Logout() {
  const router = useRouter();

  React.useEffect(() => {
    localStorage.clear();
    router.push('/auth/login');
  }, []);

  return 'logging out...';
}
