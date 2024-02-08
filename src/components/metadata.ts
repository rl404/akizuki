import { Metadata } from 'next';

const description =
  'View and edit your anime and manga list in a more modern design with custom tags editor.';
const image = '/images/edit-form-3.jpg';

export const AkizukiMetadata = (title = 'Home'): Metadata => ({
  title: title,
  description: description,
  applicationName: 'Akizuki',
  robots: {
    index: true,
    follow: false,
  },
  openGraph: {
    title: title,
    description: description,
    siteName: 'Akizuki',
    images: image,
    type: 'website',
  },
  twitter: {
    site: 'Akizuki',
    description: description,
    title: title,
    images: image,
    card: 'summary_large_image',
  },
});
