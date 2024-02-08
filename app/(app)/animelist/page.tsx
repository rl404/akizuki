import { AkizukiMetadata } from '@/src/components/metadata';
import { Metadata } from 'next';

import Animelist from './Animelist';

export const metadata: Metadata = AkizukiMetadata('Animelist');

export default function AnimelistPage() {
  return <Animelist />;
}
