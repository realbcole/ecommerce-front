import Image from 'next/image';
import React, { useState } from 'react';
import { ProductImagesProps, SelectProductImageProps } from '../types';

// Select product image component
// Used to select product image
const SelectProductImage: React.FC<SelectProductImageProps> = ({
  children,
  className,
  active,
  onClick,
}) => {
  let styles: string;
  if (active) styles = 'border border-secondary';
  else styles = '';
  return (
    <div onClick={onClick} className={`${className} ${styles}`}>
      {children}
    </div>
  );
};

// Product images component
// Used to display product images
const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState<string>(images?.[0]);
  return (
    <div className="flex">
      {/* Product image selector */}
      <div className="flex flex-col items-end gap-2 mr-2">
        {images.length > 1 && (
          <>
            {images.map((image, index) => (
              <SelectProductImage
                key={image}
                className="cursor-pointer rounded-md flex justify-center items-center"
                active={image === activeImage}
                onClick={() => setActiveImage(image)}
              >
                <div className="flex items-center justify-center bg-secondaryBg rounded-lg w-[44px] h-[44px] md:w-[60px] md:h-[60px]">
                  <div className="relative flex justify-center items-center w-[32px] h-[32px] md:w-[48px] md:h-[48px]">
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
          </>
        )}
      </div>
      {/* Selected product image */}
      <div className="flex items-center justify-center bg-secondaryBg rounded-lg w-[250px] h-[250px] md:w-[500px] md:h-[500px] flex-wrap mr-16">
        <div className="relative flex justify-center items-center w-[200px] h-[200px]  md:w-[450px] md:h-[450px]">
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
    </div>
  );
};

export default ProductImages;
