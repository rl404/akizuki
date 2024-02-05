import { AkizukiMetadata } from '@/src/components/metadata';
import { Metadata } from 'next';

import Mangalist from './Mangalist';

export const metadata: Metadata = AkizukiMetadata('Mangalist');

export default function MangalistPage() {
  return <Mangalist />;
}
