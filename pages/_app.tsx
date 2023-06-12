import { SessionProvider } from 'next-auth/react';
import CartContextProvider from '../components/CartContext';
import '../styles/globals.css';
import { AppProps } from '../types';

// App component
const App: React.FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </SessionProvider>
  );
};

export default App;
