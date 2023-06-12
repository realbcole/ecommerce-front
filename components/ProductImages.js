import Image from 'next/image';
import React, { useState } from 'react';

// Select product image component
// Used to select product image
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

// Product images component
// Used to display product images
const ProductImages = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  return (
    <div>
      {/* Selected product image */}
      <div className="flex items-center justify-center bg-secondaryBg rounded-lg min-w-[250px] min-h-[250px] md:min-w-[500px] md:min-h-[500px] flex-wrap mr-16">
        <div className="relative flex justify-center items-center min-w-[200px] min-h-[200px]  md:min-w-[450px] md:min-h-[450px]">
          <Image
            src={activeImage}
            alt="Product Image"
            fill
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
      {/* Product image selector */}
      <div className="grid grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-1 mt-4 w-[350px] md:w-[500px]">
        {images.map((image, index) => (
          <SelectProductImage
            key={image}
            className="cursor-pointer rounded-md flex justify-center items-center"
            active={image === activeImage}
            onClick={() => setActiveImage(image)}
          >
            <div className="flex items-center justify-center bg-secondaryBg rounded-lg w-[88px] h-[88px]">
              <div className="relative flex justify-center items-center w-[70px] h-[70px]">
                <Image
                  src={image}
                  alt="Product Image"
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          </SelectProductImage>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
