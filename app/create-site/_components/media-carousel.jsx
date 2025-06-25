'use client';

import Slider from 'react-slick';
import { useState, useRef, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import CustomImage from '../../Components/shared/custom-image';
import { getAlignmentClass } from '../../utils/get-text-alignment';

const MediaCarousel = ({ layoutSettings, images = [], initialSlide = 0, isModal=false }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

  useEffect(() => {
    if (slider1Ref.current) {
      setNav1(slider1Ref.current);
      // Set initial slide
      slider1Ref.current.slickGoTo(initialSlide);
    }
    if (slider2Ref.current) {
      setNav2(slider2Ref.current);
    }
  }, [initialSlide]);

  if (images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
        <p>No media available</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full max-w-full">
        <div className="rounded-lg overflow-hidden">
          <CustomImage
            src={images[0]}
            alt="media"
            className="w-full h-[400px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  const mainSettings = {
    asNavFor: nav2,
    ref: slider1Ref,
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialSlide, // Set initial slide for main slider
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const thumbSettings = {
    asNavFor: nav1,
    ref: slider2Ref,
    slidesToShow: Math.min(4, images.length),
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: false,
    arrows: false,
    dots: false,
    initialSlide: initialSlide, // Set initial slide for thumbnail slider
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, images.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, images.length),
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {!isModal && <h1 className={`lg:text-xl headings text-lg font-semibold  my-5 ${getAlignmentClass(layoutSettings)}`}>Photo Gallery</h1>}
      <div className="relative">
        <Slider {...mainSettings}>
          {images.map((src, index) => (
            <div key={index} className="rounded-lg overflow-hidden outline-none focus:outline-none">
              <CustomImage
                src={src}
                alt={`media-${index}`}
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="mt-4 px-2">
        <Slider {...thumbSettings}>
          {images.map((src, index) => (
            <div key={index} className="px-1 outline-none focus:outline-none">
              <div className="relative w-full h-24 rounded overflow-hidden border-2 border-transparent hover:border-blue-500">
                <CustomImage
                  src={src}
                  alt={`thumb-${index}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute left-2 z-10 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <RiArrowLeftSLine className="text-black text-2xl" />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute right-2 z-10 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow`}
      style={{ ...style }}
      onClick={onClick}
    >
      <RiArrowRightSLine className="text-black text-2xl" />
    </div>
  );
};

export default MediaCarousel;