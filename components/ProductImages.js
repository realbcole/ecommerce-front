import React, { useState } from 'react';

const SelectProductImage = ({ children, className, active, onClick }) => {
  let styles;
  if (active) styles = 'border-black';
  else styles = '';
  return (
    <div onClick={onClick} className={`${className} ${styles}`}>
      {children}
    </div>
  );
};

const ProductImages = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  return (
    <>
      <div className="flex items-center justify-center">
        <img
          src={activeImage}
          alt="Product Image"
          className="max-w-[100%] max-h-[400px] rounded-md"
        />
      </div>
      <div className="flex gap-4 mt-4">
        {images.map((image, index) => (
          <SelectProductImage
            key={image}
            className="border-[1px] h-24 cursor-pointer rounded-md bg-white p-1"
            active={image === activeImage}
            onClick={() => setActiveImage(image)}
          >
            <img
              src={image}
              alt={`Product image ${index}`}
              className="max-h-[100%] max-w-[100%]"
            />
          </SelectProductImage>
        ))}
      </div>
    </>
  );
};

export default ProductImages;
