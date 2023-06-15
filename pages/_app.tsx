import { SessionProvider } from 'next-auth/react';
import CartContextProvider from '../components/CartContext';
import '../styles/globals.css';
import { AppProps } from '../types';
import Head from 'next/head';

// App component
const App: React.FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ecommerce</title>
      </Head>
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
};

export default App;
