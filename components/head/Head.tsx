import Head from 'next/head';

const AkizukiHead = ({ title = 'Home' }) => {
  const description = 'View and edit your anime and manga list in a more modern design with custom tags editor.';
  const image = 'https://akizuki.rl404.com/images/edit-form-3.jpg';
  return (
    <Head>
      <title>{`${title} | Akizuki`}</title>
      <meta name="title" content={process.env.NEXT_PUBLIC_SITE_NAME} />
      <meta name="description" content={description} />
      <meta property="og:title" content={process.env.NEXT_PUBLIC_SITE_NAME} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME} />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="robots" content="index, nofollow" />
      <meta httpEquiv="Content-Type" content="text/html charset=utf-8" />
      <meta charSet="UTF-8" />
    </Head>
  );
};

export default AkizukiHead;
