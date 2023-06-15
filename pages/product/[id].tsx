import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { mongooseConnect } from '../../lib/mongoose';
import { Product } from '../../models/Product';
import Center from '../../components/Center';
import FlyingCartButton from '../../components/FlyingCartButton';
import Header from '../../components/Header';
import ProductImages from '../../components/ProductImages';
import Spinner from '../../components/Spinner';
import StarIcon from '../../components/icons/StarIcon';
import StarOutlineIcon from '../../components/icons/StarOutlineIcon';
import { RevealWrapper } from 'next-reveal';
import {
  GetServerSideProps,
  ProductPageProps,
  ProductReviewsProps,
  ProductType,
  ReviewType,
  StarsRatingProps,
} from '../../types';
import { Settings } from '../../models/Settings';

// Stars rating component
// For showing rating on review
const StarsRating: React.FC<StarsRatingProps> = ({
  rating = 5,
  onChange = () => {},
  disabled = false,
}) => {
  const [stars, setStars] = useState<number>(rating);
  const five: number[] = [1, 2, 3, 4, 5];

  // Handle star click
  function handleStarClick(star) {
    if (disabled) return;
    setStars(star);
    onChange(star);
  }

  return (
    <div className="flex">
      {five.map((star) => (
        <div
          className="cursor-pointer text-secondary"
          onClick={() => handleStarClick(star)}
          key={star}
        >
          {stars >= star ? <StarIcon /> : <StarOutlineIcon />}
        </div>
      ))}
    </div>
  );
};

// Product reviews component
// Used to display reviews on product page
const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [title, setTitle] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  // On start, load reviews
  useEffect(() => {
    loadReviews();
  }, []);

  // Load reviews
  async function loadReviews() {
    setIsLoading(true);
    await axios.get(`/api/reviews?product=${product._id}`).then((response) => {
      setReviews(response.data);
      setIsLoading(false);
    });
  }

  // Submit review
  function submitReview() {
    axios
      .post('/api/reviews', {
        userName: session?.user?.name,
        title,
        rating,
        description,
        product: product._id,
      })
      .then(() => {
        setTitle('');
        setRating(0);
        setDescription('');
        loadReviews();
      });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-8">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add review card */}
        <div className="bg-primaryDark p-4 rounded-lg flex flex-col gap-2">
          <h3 className="text-2xl text-secondaryBg">Add Review</h3>
          {session ? (
            <>
              <StarsRating rating={rating} onChange={setRating} />
              <input
                placeholder="Title"
                className="rounded-md py-1 px-2 bg-secondaryBg text-primaryDark placeholder:text-primaryDark/50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <textarea
                placeholder="What did you think?"
                className="rounded-md py-1 px-2 h-full min-h-[100px] max-h-[300px]  bg-secondaryBg text-primaryDark placeholder:text-primaryDark/50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              <button
                className="bg-secondary rounded-md py-1 px-2 text-secondaryBg"
                onClick={submitReview}
              >
                Post
              </button>
            </>
          ) : (
            <p className="text-secondaryBg">Log in to leave a review.</p>
          )}
        </div>
        {/* All reviews card */}
        <div className="bg-primaryDark p-4 rounded-lg flex flex-col gap-2">
          <h3 className="text-2xl text-secondaryBg">All Reviews</h3>
          {isLoading ? (
            <Spinner className="mt-8" />
          ) : (
            <>
              {reviews.length > 0 ? (
                <>
                  {reviews.map((review) => (
                    <div className="border-b border-secondaryBg p-2">
                      <div className="grid grid-cols-2" key={review._id}>
                        <StarsRating rating={review.rating} disabled />

                        <div className="ml-auto text-secondaryBg">
                          <time>
                            {new Date(review.createdAt).toLocaleString()}
                          </time>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-secondaryBg">
                          {review.title}
                        </p>
                        <span className="text-xs text-secondaryBg/75">
                          {review.userName}
                        </span>
                        <p className="text-secondaryBg/75 text-lg">
                          {review.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-secondaryBg">No reviews found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Product page component
// Used to display specific product page
const ProductPage: React.FC<ProductPageProps> = ({ product, shopName }) => {
  return (
    <>
      <Header shopName={shopName} />
      <div className="bg-primaryBg min-h-screen w-full overflow-x-hidden">
        <Center>
          <div className="grid grid-cols-1 lg:grid-cols-product mt-24">
            {/* Product images */}
            <RevealWrapper
              className="flex justify-start lg:justify-end items-center"
              delay={20}
            >
              <ProductImages images={product.images} />
            </RevealWrapper>
            {/* Product info */}
            <RevealWrapper
              className="mt-8 lg:mt-0 lg:ml-8 text-primaryDark"
              delay={20}
            >
              <h1 className="text-4xl font-bold">{product.title}</h1>
              <p className="my-4">{product.description}</p>
              <div className="flex gap-4 items-center">
                <h2 className="font-semibold text-2xl">${product.price}</h2>
                <FlyingCartButton
                  src={product.images[0]}
                  productId={product._id}
                  text
                />
              </div>
            </RevealWrapper>
          </div>
          {/* Product reviews */}
          <RevealWrapper delay={20}>
            <ProductReviews product={product} />
          </RevealWrapper>
        </Center>
      </div>
    </>
  );
};

export default ProductPage;

// Get product data before page load
// This is done server side
export async function getServerSideProps(ctx: GetServerSideProps) {
  await mongooseConnect();
  const { id } = ctx?.query;
  const product: ProductType = await Product.findById(id);

  const shopName = await Settings.findOne({ name: 'shopName' });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      shopName: JSON.parse(JSON.stringify(shopName?.value)),
    },
  };
}
