import React, { useState, useEffect } from 'react';
import MovieGrid from './MovieGrid';
import CategoryHero from './CategoryHero';

const CategoryPageLayout = ({
  title,
  description,
  category,
  apiEndpoint,
  showHero = true,
  mediaType = 'movie',
  // Allow injecting a custom grid (e.g., AnimeGrid). Defaults to MovieGrid.
  GridComponent = MovieGrid,
}) => {
  const [trendingImages, setTrendingImages] = useState([]);

  // Fetch trending content for the background
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        if (mediaType === 'anime') {
          // Fetch from AniList for Anime
          const query = `
            query {
              Page(page: 1, perPage: 5) {
                media(type: ANIME, sort: TRENDING_DESC, status_not_in: [NOT_YET_RELEASED, CANCELLED]) {
                  bannerImage
                  coverImage { extraLarge }
                }
              }
            }
          `;

          const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ query }),
          });

          const json = await response.json();
          const images = json?.data?.Page?.media
            .map(m => m.bannerImage || m.coverImage?.extraLarge)
            .filter(Boolean) || [];

          setTrendingImages(images);

        } else {
          // Fetch from TMDB for Movie/TV
          const trendingType = ['movie', 'tv'].includes(mediaType) ? mediaType : 'tv';
          const response = await fetch(
            `https://api.themoviedb.org/3/trending/${trendingType}/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
          );
          const data = await response.json();

          const backdrops = data.results
            .slice(0, 8)
            .map(item => item.backdrop_path)
            .filter(Boolean);

          setTrendingImages(backdrops);
        }
      } catch (error) {
        console.error('Error fetching trending content:', error);
      }
    };

    fetchTrending();
  }, [mediaType]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero Section with cycling background */}
      {showHero && (
        <CategoryHero
          title={title}
          description={description}
          images={trendingImages}
        />
      )}

      {/* Content Section */}
      <div className="p-4 md:p-8">
        <GridComponent
          category={category}
          apiEndpoint={apiEndpoint}
          mediaType={mediaType}
        />
      </div>
    </div>
  );
};

export default CategoryPageLayout;
