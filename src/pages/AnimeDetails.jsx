import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Play } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const ANILIST_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      title { romaji english native }
      bannerImage
      coverImage { extraLarge large }
      description
      episodes
      genres
      trailer { id site thumbnail }
      averageScore
      status
      startDate { year month day }
      format
      characters(sort: ROLE, perPage: 20) {
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
        }
      }
      recommendations(perPage: 10, sort: RATING_DESC) {
        edges {
          node {
            mediaRecommendation {
              id
              title { romaji }
              coverImage { large }
              averageScore
            }
          }
        }
      }
    }
  }
`;

const AnimeDetailsPage = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [episodeRange, setEpisodeRange] = useState(1);
    const episodesPerPage = 50;

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchAnime = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: ANILIST_QUERY,
                        variables: { id: parseInt(id) }
                    }),
                });

                const json = await response.json();
                setAnime(json?.data?.Media);
            } catch (error) {
                console.error('Error fetching anime:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0b0b0b]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            </div>
        );
    }

    if (!anime) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0b0b0b] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Anime Not Found</h2>
                    <p className="text-gray-400">Unable to load anime details.</p>
                </div>
            </div>
        );
    }

    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

    const totalEpisodes = anime.episodes || 0;
    const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
    const startEpisode = (episodeRange - 1) * episodesPerPage + 1;
    const endEpisode = Math.min(episodeRange * episodesPerPage, totalEpisodes);

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white relative overflow-x-hidden">
            {/* Ambient Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-end pb-16 z-10" style={{
                backgroundImage: anime.bannerImage ? `url(${anime.bannerImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/80 via-transparent to-transparent"></div>

                <div className="relative z-10 container mx-auto px-4 flex gap-8 items-end">
                    {/* Cover Image */}
                    <div className="hidden md:block flex-shrink-0">
                        <img
                            src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                            alt={anime.title?.romaji}
                            className="w-64 rounded-2xl shadow-2xl border-2 border-white/10"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-2xl">
                            {anime.title?.english || anime.title?.romaji}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs md:text-sm">
                            {anime.averageScore && (
                                <span className="flex items-center gap-1 text-yellow-400 font-medium">
                                    ⭐ {(anime.averageScore / 10).toFixed(1)}
                                </span>
                            )}
                            {anime.startDate?.year && (
                                <span>{anime.startDate.year}</span>
                            )}
                            {anime.format && (
                                <span className="border border-white/30 px-2 py-0.5 text-xs rounded">
                                    {anime.format}
                                </span>
                            )}
                            {anime.status && (
                                <span className="border border-white/30 px-2 py-0.5 text-xs rounded">
                                    {anime.status}
                                </span>
                            )}
                            {totalEpisodes > 0 && (
                                <span className="border border-white/30 px-2 py-0.5 text-xs rounded">
                                    {totalEpisodes} Episodes
                                </span>
                            )}
                        </div>

                        {anime.genres && anime.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {anime.genres.slice(0, 5).map((genre, idx) => (
                                    <span key={idx} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="max-w-3xl text-gray-200 mb-6 text-base leading-relaxed line-clamp-3">
                            {stripHtml(anime.description)}
                        </p>

                        <div className="flex space-x-4">
                            <Link to={`/watch/anime/${anime.id}/1/1`} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
                                <Play className="w-5 h-5 mr-2" /> Play
                            </Link>
                            {anime.trailer?.site?.toLowerCase() === "youtube" && anime.trailer?.id && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-semibold flex items-center border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 mr-2" /> Trailer
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Episodes Section */}
            {totalEpisodes > 0 && (
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Episodes</h2>

                        {/* Episode Range Selector */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Range:</span>
                                <select
                                    value={episodeRange}
                                    onChange={(e) => setEpisodeRange(Number(e.target.value))}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                                >
                                    {Array.from({ length: totalPages }, (_, i) => {
                                        const start = i * episodesPerPage + 1;
                                        const end = Math.min((i + 1) * episodesPerPage, totalEpisodes);
                                        return (
                                            <option key={i + 1} value={i + 1}>
                                                Episodes {start}-{end}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Episode Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                        {Array.from({ length: endEpisode - startEpisode + 1 }, (_, i) => {
                            const episodeNum = startEpisode + i;
                            return (
                                <div
                                    key={episodeNum}
                                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 cursor-pointer group"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <span className="text-3xl font-bold text-white/40">{episodeNum}</span>
                                    </div>
                                    <p className="text-sm font-medium text-center">Episode {episodeNum}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Info */}
                    {totalPages > 1 && (
                        <div className="text-center mt-6 text-sm text-gray-400">
                            Showing episodes {startEpisode}-{endEpisode} of {totalEpisodes}
                        </div>
                    )}
                </div>
            )}

            {/* Characters Section */}
            {anime.characters?.edges && anime.characters.edges.length > 0 && (
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <h2 className="text-2xl font-bold mb-6">Characters</h2>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView="auto"
                        navigation
                        className="pb-4"
                    >
                        {anime.characters.edges.map((edge, idx) => (
                            <SwiperSlide key={idx} style={{ width: 'auto' }}>
                                <div className="w-32 group cursor-pointer">
                                    <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-2">
                                        <img
                                            src={edge.node.image?.large}
                                            alt={edge.node.name?.full}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <p className="text-xs font-medium text-center line-clamp-2">
                                        {edge.node.name?.full}
                                    </p>
                                    <p className="text-xs text-gray-500 text-center capitalize">
                                        {edge.role?.toLowerCase()}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Recommendations Section */}
            {anime.recommendations?.edges && anime.recommendations.edges.length > 0 && (
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView="auto"
                        navigation
                        className="pb-4"
                    >
                        {anime.recommendations.edges
                            .filter(edge => edge.node?.mediaRecommendation)
                            .map((edge, idx) => {
                                const rec = edge.node.mediaRecommendation;
                                return (
                                    <SwiperSlide key={idx} style={{ width: 'auto' }}>
                                        <Link to={`/anime/${rec.id}`} className="block w-40 group">
                                            <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-2">
                                                <img
                                                    src={rec.coverImage?.large}
                                                    alt={rec.title?.romaji}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                                {rec.averageScore && (
                                                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-lg text-xs font-bold text-green-400">
                                                        {rec.averageScore}%
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium line-clamp-2 group-hover:text-white transition-colors">
                                                {rec.title?.romaji}
                                            </p>
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default AnimeDetailsPage;
