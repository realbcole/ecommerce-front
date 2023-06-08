import Center from '@/components/Center';
import FlyingCartButton from '@/components/FlyingCartButton';
import Header from '@/components/Header';
import ProductImages from '@/components/ProductImages';
import Spinner from '@/components/Spinner';
import StarIcon from '@/components/icons/StarIcon';
import StarOutlineIcon from '@/components/icons/StarOutlineIcon';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const StarsRating = ({ rating = 0, onChange = () => {}, disabled = false }) => {
  const [stars, setStars] = useState(rating);
  const five = [1, 2, 3, 4, 5];

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

const ProductReviews = ({ product }) => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setIsLoading(true);
    await axios.get(`/api/reviews?product=${product._id}`).then((response) => {
      setReviews(response.data);
      setIsLoading(false);
    });
  }

  function submitReview() {
    axios
      .post('/api/reviews', {
        title,
        rating,
        description,
        product: product._id,
      })
      .then((response) => {
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
        <div className="bg-primaryGray p-4 rounded-lg flex flex-col gap-2">
          <h3 className="font-bold text-2xl">Add Review</h3>
          <StarsRating rating={rating} onChange={setRating} />
          <input
            placeholder="Title"
            className="rounded-md py-1 px-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <textarea
            placeholder="What did you think?"
            className="rounded-md py-1 px-2 h-full min-h-[100px] max-h-[300px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <button
            className="bg-secondary rounded-md py-1 px-2"
            onClick={submitReview}
          >
            Post
          </button>
        </div>
        <div className="bg-primaryGray p-4 rounded-lg">
          <h3 className="font-bold text-2xl">All Reviews</h3>
          {isLoading ? (
            <div className="flex justify-center items-center mt-8">
              <Spinner />
            </div>
          ) : (
            <>
              {reviews.length > 0 ? (
                <>
                  {reviews.map((review) => (
                    <div
                      className="grid grid-cols-2 my-2 border-b border-white p-2"
                      key={review._id}
                    >
                      <div>
                        <StarsRating rating={review.rating} disabled />
                        <p className="font-semibold text-xl text-primaryDark pl-1">
                          {review.title}
                        </p>
                        <p className="text-primaryDark/75 pl-2">
                          {review.description}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <time>
                          {new Date(review.createdAt).toLocaleString()}
                        </time>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p>No reviews found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductPage = ({ product }) => {
  return (
    <>
      <Header />
      <div className="bg-primaryBg min-h-screen">
        <Center>
          <div className="grid grid-cols-1 md:grid-cols-product mt-24">
            <div className="bg-primaryGray rounded-lg p-8">
              <ProductImages images={product.images} />
            </div>
            <div className="mt-8 md:m-8">
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p>{product.description}</p>
              <div className="flex gap-4 items-center">
                <h2 className="font-semibold text-2xl">${product.price}</h2>
                <FlyingCartButton
                  src={product.images[0]}
                  productId={product._id}
                  solid
                  text
                />
              </div>
            </div>
          </div>
          <ProductReviews product={product} />
        </Center>
      </div>
    </>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context?.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
