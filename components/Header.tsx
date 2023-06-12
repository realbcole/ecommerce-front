import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Center from './Center';
import { CartContext } from './CartContext';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';
import { HeaderProps } from '../types';

// Header component
// Used to display header on every page
const Header: React.FC<HeaderProps> = ({ shopName }) => {
  const [mobileNavActive, setMobileNavActive] = useState<boolean>(false);

  const { cartProducts } = useContext(CartContext);
  const { pathname } = useRouter();

  const navLinkStyles: string =
    'text-secondaryBg/75 block my-6 md:my-0 text-xl md:text-lg';
  const activeNavLinkStyles: string = `${navLinkStyles} !text-secondaryBg`;

  // Function to return appropriate styles based on active link
  function getNavLinkStyles(path: string): string {
    return pathname === path ? activeNavLinkStyles : navLinkStyles;
  }

  return (
    <header
      className={`bg-primaryDark z-20 fixed w-full ${
        mobileNavActive ? 'h-screen' : 'h-20'
      } !md:h-auto transition-all`}
    >
      <Center>
        <div className="flex justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`${navLinkStyles} !text-secondaryBg text-xl !my-0`}
          >
            {shopName ? `${shopName}` : 'Ecommerce'}
          </Link>
          {/* Navbar */}
          <nav
            className={`absolute mt-8 md:mt-0 md:static md:flex md:gap-6 ${
              mobileNavActive ? 'block' : 'hidden'
            }`}
          >
            <Link className={getNavLinkStyles('/')} href="/">
              Home
            </Link>
            <Link className={getNavLinkStyles('/products')} href="/products">
              Products
            </Link>
            <Link
              className={getNavLinkStyles('/categories')}
              href="/categories"
            >
              Categories
            </Link>
            <Link className={getNavLinkStyles('/account')} href="/account">
              Account
            </Link>
            <Link className={getNavLinkStyles('/cart')} href="/cart">
              Cart ({cartProducts.length})
            </Link>
          </nav>
          {/* Search icon */}
          <Link
            className={`${navLinkStyles} fixed top-2 right-20 md:static text-secondaryBg`}
            href="/products"
          >
            <SearchIcon />
          </Link>
          {/* Mobile nav button */}
          <button
            className="text-secondaryBg cursor-pointer md:hidden fixed right-8 top-8"
            onClick={() => setMobileNavActive((prev) => !prev)}
          >
            <MenuIcon />
          </button>
        </div>
      </Center>
    </header>
  );
};

export default Header;
