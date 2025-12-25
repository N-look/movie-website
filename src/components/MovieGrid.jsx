import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { Play, Star, Calendar } from 'lucide-react';

const MovieGrid = ({ category, apiEndpoint, mediaType = 'movie' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  // ✅ Replace with your TMDb v3 API key
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const fetchData = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);

      const url = apiEndpoint.includes('?')
        ? `${apiEndpoint}&api_key=${API_KEY}&page=${pageNum}`
        : `${apiEndpoint}?api_key=${API_KEY}&page=${pageNum}`; //This is a duplicate and will not be replaced

      const response = await fetch(url);

      if (!response.ok) {
        console.error('TMDb API error:', await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.results && result.results.length > 0) {
        setData((prev) => (append ? [...prev, ...result.results] : result.results));
        setHasMore(pageNum < (result.total_pages || 1));
      } else {
        if (!append) setData([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!append) setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, false);
  }, [apiEndpoint]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  }, [loading, hasMore, page]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400 mb-4">No content found</h3>
        <p className="text-gray-500">Try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
        {data.map((item) => {
          // ✅ Always build an image URL or fallback
          let imageUrl = null;
          if (item.poster_path) {
            imageUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          } else if (item.backdrop_path) {
            imageUrl = `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
          }

          return (
            <div
              key={item.id}
              className="group"
            >
              <Link to={`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`} className="block">
                <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-3">
                  <img
                    src={imageUrl}
                    alt={item.title || item.name || mediaType === 'tv' ? 'TV Show' : 'Movie'}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
                    }}
                  />

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>

                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                  {item.title || item.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>
                    {item.release_date?.slice(0, 4) ||
                      item.first_air_date?.slice(0, 4) ||
                      'N/A'}
                  </span>
                  <span>•</span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                    <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {loading && data.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading more...</span>
          </div>
        )}
        {!hasMore && data.length > 0 && (
          <span className="text-gray-500">You've reached the end</span>
        )}
      </div>
    </div>
  );
};

export default MovieGrid;
