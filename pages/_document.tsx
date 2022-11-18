import { Html, Head, Main, NextScript } from 'next/document';
import { theme } from '../components/theme';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <body
        style={{ backgroundImage: `radial-gradient(rgb(65, 65, 65) 0.5px, ${theme.palette.background.default} 0.5px)` }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
