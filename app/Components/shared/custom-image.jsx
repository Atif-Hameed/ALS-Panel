import Image from 'next/image';
import React from 'react'

const CustomImage = ({ alt = '', src, className, width = '1000', height = '1000', divStyle }) => {
  return (
    <div className={`${divStyle}`}>
      <Image
        alt={alt}
        src={src}
        className={`${className}`}
        width={width}
        height={height}
      />
    </div>
  )
}

export default CustomImage;
