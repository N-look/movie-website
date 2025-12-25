import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Calendar,
} from "lucide-react";
import {
  getTvShowEmbed,
  getNextSourceIndex,
  getAllSources,
} from "../lib/streamingService";

const TMDB_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
  },
};

const WatchTvShow = () => {
  const { id, season: seasonParam, episode: episodeParam } = useParams();
  const navigate = useNavigate();

  const season = useMemo(() => Number(seasonParam) || 1, [seasonParam]);
  const episode = useMemo(() => Number(episodeParam) || 1, [episodeParam]);

  const [tvShow, setTvShow] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showSourceSelector, setShowSourceSelector] = useState(false);

  const embedInfo = getTvShowEmbed(id, season, episode, sourceIndex);
  const allSources = getAllSources();

  const handleSourceChange = (newIndex) => {
    setPlayerLoading(true);
    setSourceIndex(newIndex);
  };

  // Fetch TV show and season details
  useEffect(() => {
    Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, TMDB_OPTIONS),
      fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?language=en-US`, TMDB_OPTIONS),
    ])
      .then(([showRes, seasonRes]) => Promise.all([showRes.json(), seasonRes.json()]))
      .then(([showData, seasonInfo]) => {
        setTvShow(showData);
        setSeasonData(seasonInfo);
        const epData = seasonInfo.episodes?.find((ep) => ep.episode_number === episode);
        setEpisodeData(epData);
      })
      .catch((err) => console.error(err));
  }, [id, season, episode]);

  // Reset loading when episode changes
  useEffect(() => {
    setPlayerLoading(true);
  }, [id, season, episode]);

  const handleNextSource = () => {
    handleSourceChange(getNextSourceIndex(sourceIndex));
  };

  const handleSourceSelect = (index) => {
    if (index !== sourceIndex) {
      handleSourceChange(index);
    }
    setShowSourceSelector(false);
  };

  // Navigation helpers
  const hasPrevEpisode = episode > 1;
  const hasNextEpisode = seasonData?.episodes?.some(
    (ep) => ep.episode_number === episode + 1
  );

  const goToPrevEpisode = () => {
    if (hasPrevEpisode) {
      navigate(`/watch/tv/${id}/${season}/${episode - 1}`);
    }
  };

  const goToNextEpisode = () => {
    if (hasNextEpisode) {
      navigate(`/watch/tv/${id}/${season}/${episode + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to={`/tv/${id}`}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Link>
        <div className="w-24" />
      </div>

      {/* Player container */}
      <div className="max-w-[1400px] mx-auto px-4 pb-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {playerLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin" />
            </div>
          )}
          <iframe
            key={`${id}-${season}-${episode}-${sourceIndex}`}
            src={embedInfo.url}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="origin"
            {...(embedInfo.sandbox && { sandbox: "allow-scripts allow-same-origin allow-forms" })}
            onLoad={() => setPlayerLoading(false)}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[1400px] mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Controls Section */}
          <div className="flex-1">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    Episode {episode}
                    <span className="text-gray-400 font-normal ml-2">
                      {episodeData?.name}
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowSourceSelector(!showSourceSelector)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <span className="text-gray-400">Source:</span>
                      <span className="text-white">{embedInfo.sourceName}</span>
                    </button>

                    {showSourceSelector && (
                      <div className="absolute top-full right-0 mt-2 bg-[#252525] border border-white/10 rounded-lg overflow-hidden min-w-[180px] z-20 shadow-xl">
                        {allSources.map((source) => (
                          <button
                            key={source.index}
                            onClick={() => handleSourceSelect(source.index)}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${
                              source.index === sourceIndex
                                ? "text-[#3B82F6] bg-white/5"
                                : "text-gray-300"
                            }`}
                          >
                            {source.name}
                            {source.hasAds && (
                              <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                                ADS
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNextSource}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-gray-300 hover:text-white"
                    title="Try Next Source"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={goToPrevEpisode}
                  disabled={!hasPrevEpisode}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    hasPrevEpisode
                      ? "bg-white/10 hover:bg-white/20 text-white hover:scale-[1.02]"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous Episode
                </button>

                <button
                  onClick={goToNextEpisode}
                  disabled={!hasNextEpisode}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    hasNextEpisode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Next Episode
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Episode Info */}
              {episodeData && (
                <div className="border-t border-white/5 pt-6">
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    {episodeData.overview || "No overview available for this episode."}
                  </p>
                  {episodeData.air_date && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Aired: {new Date(episodeData.air_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-6 text-center">
          If the video doesn't load or has issues, try switching to a different source using the selector above.
        </p>
      </div>
    </div>
  );
};

export default WatchTvShow;
