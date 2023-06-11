import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Center from './Center';
import { CartContext } from './CartContext';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';

// Header component
// Used to display header on every page
const Header = ({ shopName }) => {
  const [mobileNavActive, setMobileNavActive] = useState(false);

  const { cartProducts } = useContext(CartContext);

  const navLinkStyles =
    'text-secondaryBg block my-6 md:my-0 text-xl md:text-lg';

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
            <Link className={navLinkStyles} href="/">
              Home
            </Link>
            <Link className={navLinkStyles} href="/products">
              Products
            </Link>
            <Link className={navLinkStyles} href="/categories">
              Categories
            </Link>
            <Link className={navLinkStyles} href="/account">
              Account
            </Link>
            <Link className={navLinkStyles} href="/cart">
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
