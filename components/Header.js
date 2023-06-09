import Link from 'next/link';
import React, { useContext, useState } from 'react';
import Center from './Center';
import { CartContext } from './CartContext';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';

const navLinkStyles = 'text-primaryBg block my-6 md:my-0 text-xl md:text-base';

const Header = () => {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  return (
    <header
      className={`bg-primaryDark z-20 fixed w-full ${
        mobileNavActive ? 'h-screen' : 'h-auto'
      } !md:h-auto`}
    >
      <Center>
        <div className="flex justify-between">
          <Link
            href="/"
            className={`${navLinkStyles} !text-primaryBg text-xl !my-0`}
          >
            Ecommerce
          </Link>
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
          <Link
            className={`${navLinkStyles} fixed top-2 right-20 md:static text-primaryBg`}
            href="/products"
          >
            <SearchIcon />
          </Link>
          <button
            className="text-primaryBg cursor-pointer md:hidden fixed right-8 top-8"
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
