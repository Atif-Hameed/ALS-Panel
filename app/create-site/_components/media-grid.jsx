'use client';

import CustomImage from '../../Components/shared/custom-image';
import React, { useState } from 'react';
import MediaCarousel from './media-carousel';
import { getAlignmentClass } from '../../utils/get-text-alignment';

const MediaGrid = ({ layoutSettings, data = [], isWeb=true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const gridStyle = isWeb ? 'xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2' : 'xl:grid-cols-4 lg:grid-cols-3 grid-cols-2'

  return (
    <div className='my-4'>
      <h1 className={`lg:text-xl headings text-lg font-semibold  my-5 ${getAlignmentClass(layoutSettings)}`}>Photo Gallery</h1>
      <div className={`grid ${gridStyle}  ${layoutSettings.galleryLayout === 'gridNarrowView' ? 'gap-2' : 'gap-5'}`}>
        {data?.map((e, i) => (
          <div
            key={i}
            className={`h-[200px] bg-white  shadow-lg cursor-pointer ${layoutSettings.galleryLayout === 'gridNarrowView' ? 'p-0.5' : 'p-2'}`}
            onClick={() => handleImageClick(i)}
          >
            <CustomImage
              src={e}
              alt={`media-${i}`}
              className="!w-full !h-full !object-cover"
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full relative">
            <button
              className="absolute cursor-pointer -top-2 right-0 z-50 text-black text-3xl"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <MediaCarousel images={data} initialSlide={selectedIndex} isModal={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;