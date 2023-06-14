import { GetServerSidePropsContext } from 'next';
import { Adapter } from 'next-auth/adapters';
import { OAuthConfig } from 'next-auth/providers';
import { GoogleProfile } from 'next-auth/providers/google';
import { ReactNode } from 'react';

// PAGE PROPS
export interface AppProps {
  Component: React.FC;
  pageProps: {
    session: Session;
    [key: string]: any;
  };
}

export interface ProductsPageProps {
  categories: CategoryType[];
  wishlist: string[];
  defaultFilters: { name: string; value: string }[];
  allProducts: ProductType[];
  shopName: string;
}

export interface HomePageProps {
  featuredProduct: ProductType;
  newProducts: ProductType[];
  wishlist: string[];
  shopName: string;
}

export interface CategoriesPageProps {
  mainCategories: CategoryType[];
  categoriesProducts: { [key: string]: ProductType[] };
  wishlist: string[];
  shopName: string;
}

export interface AccountPageProps {
  orderData: OrderType[];
  accountDetails: AccountDetailsType;
  wishlistData: ProductType[];
  shopName: string;
}

export interface ProductPageProps {
  product: ProductType;
  shopName: string;
}

export interface CategoryPageProps {
  category: CategoryType;
  products: ProductType[];
  subCategories: CategoryType[];
  wishlist: string[];
  defaultSort: string;
  defaultFilters: Filter[];
  shopName: string;
}

// MODEL TYPES
export interface Filter {
  category?: string;
  name: string;
  value: string;
}

export interface OrderDetailsProps {
  order: OrderType;
}

export interface ProductReviewsProps {
  product: ProductType;
}

export interface CategoryType {
  _id: string;
  name: string;
  parent: string;
  properties: Property[];
}

export interface AccountDetailsType {
  _id?: string;
  userEmail?: string;
  name: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ReviewType {
  _id: string;
  userName: string;
  title: string;
  description: string;
  rating: number;
  product: ProductType;
  createdAt: string;
  updatedAt: string;
}

export interface OrderType {
  userEmail: string;
  line_items: line_item[];
  name: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface line_item {
  quantity?: number;
  subTotal?: number;
  price?: string;
  price_data?: {
    currency?: string;
    product?: string;
    product_data?: {
      name?: string;
    };
    unit_amount?: number;
  };
}
export interface Property {
  name: string;
  values: string[];
}

export interface WishlistProductType {
  _id: string;
  product: ProductType;
  userEmail: string;
}

export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: CategoryType;
  properties: { [key: string]: string };
  stripePriceId: string;
  hidden: boolean;
}

export interface SettingsType {
  name: string;
  value: string;
}

// COMPONENT PROPS
export interface SpinnerProps {
  className?: string;
}

export interface TabProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export interface TabsProps {
  tabs: string[];
  active: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}

export interface ProductImagesProps {
  images: string[];
}

export interface SelectProductImageProps {
  children: ReactNode;
  className: string;
  active: boolean;
  onClick: () => void;
}

export interface NewProductsProps {
  products: ProductType[];
  wishlist: string[];
}

export interface FeaturedProps {
  product: ProductType;
}

export interface StarsRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}

export interface HeaderProps {
  shopName: string;
}

export interface CenterProps {
  children: ReactNode;
  className?: string;
}

export interface ProductsFlexProps {
  products: ProductType[];
  wishlist: string[];
  category?: CategoryType;
  left?: boolean;
}

export interface ProductBoxProps {
  product: ProductType;
  inWishlist: boolean;
  onRemove?: (productId: string) => void;
  wishlist?: boolean;
}

export interface FlyingCartButtonProps {
  src: string;
  productId: string;
  smaller?: boolean;
  text?: boolean;
}

export interface IconProps {
  className?: string;
}

export interface AccountInputProps {
  className?: string;
}

export interface CartContextType {
  cartProducts: string[];
  setCartProducts: React.Dispatch<React.SetStateAction<string[]>>;
  addProductToCart: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
}

// OTHER TYPES
export interface GetServerSideProps {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
  query?: {
    id: string;
  };
}

export interface authOptionsType {
  secret: string;
  providers: OAuthConfig<GoogleProfile>[];
  adapter: Adapter;
}

export interface User {
  name?: string;
  email?: string;
  image?: string;
}

export interface Session {
  user?: User;
  expires: string;
}
