import { AkizukiMetadata } from '@/src/components/metadata';
import { Metadata } from 'next';

import Profile from './Profile';

export const metadata: Metadata = AkizukiMetadata('Profile');

export default function Home() {
  return <Profile />;
}
