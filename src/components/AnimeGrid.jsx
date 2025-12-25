import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Star, Calendar } from 'lucide-react';

// GraphQL query to fetch trending/popular anime
const ANILIST_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: $sort, status_not_in: [NOT_YET_RELEASED, CANCELLED]) {
        id
        title { english romaji native }
        coverImage { extraLarge large medium color }
        bannerImage
        averageScore
        startDate { year }
        description(asHtml: true)
      }
    }
  }
`;

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

const AnimeGrid = ({ sort = ['TRENDING_DESC'] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const fetchPage = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);

      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: ANILIST_QUERY,
          variables: { page: pageNum, perPage: 20, sort },
        }),
      });

      if (!res.ok) {
        console.error('AniList API error:', await res.text());
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const media = json?.data?.Page?.media || [];

      const mapped = media.map((m) => ({
        id: m.id,
        title: m.title?.english || m.title?.romaji || m.title?.native || 'Untitled',
        imageUrl:
          m.coverImage?.extraLarge ||
          m.coverImage?.large ||
          m.coverImage?.medium ||
          m.bannerImage ||
          null,
        score: typeof m.averageScore === 'number' ? (m.averageScore / 10).toFixed(1) : 'N/A',
        year: m.startDate?.year || 'N/A',
        overview: stripHtml(m.description || '').slice(0, 160),
        anilistUrl: `https://anilist.co/anime/${m.id}`,
      }));

      setItems((prev) => (append ? [...prev, ...mapped] : mapped));
      setHasMore(Boolean(json?.data?.Page?.pageInfo?.hasNextPage));
    } catch (err) {
      console.error('Error fetching AniList data:', err);
      if (!append) setItems([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sort)]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
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

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400 mb-4">No anime found</h3>
        <p className="text-gray-500">Try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group"
          >
            <a href={item.anilistUrl} target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-3">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image'}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
                  }}
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{item.year}</span>
                <span>•</span>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  <span>{item.score}</span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {loading && items.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading more...</span>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <span className="text-gray-500">You've reached the end</span>
        )}
      </div>
    </div>
  );
};

export default AnimeGrid;
