import Head from 'next/head';

export default function AkizukiHead({ title = 'Home' }) {
  const description = 'View and edit your anime and manga list in a more modern design with custom tags editor.';
  const image = '';
  return (
    <Head>
      <title>{`${title} | Akizuki`}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="keyword" content="" />
      <meta name="robots" content="noindex" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <meta httpEquiv="Content-Type" content="text/html charset=utf-8" />
    </Head>
  );
}
