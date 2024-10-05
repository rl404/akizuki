'use client';

import AkizukiAppBar from '@/src/components/commons/AppBar';
import ScrollToTop from '@/src/components/commons/ScrollToTop';
import { getAccessToken } from '@/src/utils/user';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    !getAccessToken() && router.push('/auth/login');
  }, [router]);

  return (
    <>
      <AkizukiAppBar />
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>{children}</Container>
      <ScrollToTop />
    </>
  );
}
