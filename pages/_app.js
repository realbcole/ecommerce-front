import { SessionProvider } from 'next-auth/react';
import CartContextProvider from '@/components/CartContext';
import '@/styles/globals.css';

// App component
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </SessionProvider>
  );
}
