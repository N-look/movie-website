import React, { useState, useEffect } from 'react'
import CardImg from "../assets/cardimg.jpg"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";

const CardList = ({ title, category, mediaType = 'movie' }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMovies = async (pageNum) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${category}?language=en-US&page=${pageNum}`,
                {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`
                    }
                }
            );
            const res = await response.json();

            if (res.results && res.results.length > 0) {
                setData(prev => pageNum === 1 ? res.results : [...prev, ...res.results]);
                setPage(pageNum);
                setHasMore(pageNum < res.total_pages);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset state when category/mediaType changes
        setData([]);
        setPage(1);
        setHasMore(true);
        fetchMovies(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, mediaType]);

    const handleReachEnd = () => {
        if (hasMore && !loading) {
            fetchMovies(page + 1);
        }
    };


    return (
        <div className="text-white">
            <h2 className='text-xl font-bold mb-4 px-1'>{title}</h2>

            <Swiper
                slidesPerView={"auto"}
                spaceBetween={16}
                className="mySwiper !pb-4"
                onReachEnd={handleReachEnd}
            >
                {data.map((item, index) => (
                    <SwiperSlide key={index} className="max-w-[200px]">
                        <Link to={`/${mediaType}/${item.id}`} className="block group">
                            <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-3">
                                <img
                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image'}
                                    alt={item.title || item.name}
                                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <p className='text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1'>
                                {item.title || item.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span>{new Date(item.release_date || item.first_air_date).getFullYear() || 'N/A'}</span>
                                <span>•</span>
                                <span className="flex items-center text-yellow-500">
                                    ★ {item.vote_average?.toFixed(1)}
                                </span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default CardList