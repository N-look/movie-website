import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './CategoryHero.css';

const CategoryHero = ({ title, description, images = [] }) => {
  if (images.length === 0) return null;

  return (
    <div className="relative h-64 md:h-96 w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect={'fade'}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        allowTouchMove={false}
        className="h-full"
      >
        {images.map((img, index) => {
          // Check if img is a full URL (AniList) or a path (TMDB)
          const bgImage = img.startsWith('http')
            ? img
            : `https://image.tmdb.org/t/p/original${img}`;

          return (
            <SwiperSlide key={index}>
              <div
                className="h-full w-full bg-cover bg-center relative transition-all duration-1000"
                style={{
                  backgroundImage: `url(${bgImage})`
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-8">
                  <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
                  {description && (
                    <p className="text-lg text-gray-300 mt-2 max-w-2xl">{description}</p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default CategoryHero;
