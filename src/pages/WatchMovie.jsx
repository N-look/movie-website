import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, SkipForward } from "lucide-react";
import {
  getMovieEmbed,
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

const WatchMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(true);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showSourceSelector, setShowSourceSelector] = useState(false);

  const embedInfo = getMovieEmbed(id, sourceIndex);
  const allSources = getAllSources();

  const handleSourceChange = (newIndex) => {
    setPlayerLoading(true);
    setSourceIndex(newIndex);
  };

  // Fetch movie details
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      TMDB_OPTIONS
    )
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleNextSource = () => {
    handleSourceChange(getNextSourceIndex(sourceIndex));
  };

  const handleSourceSelect = (index) => {
    if (index !== sourceIndex) {
      handleSourceChange(index);
    }
    setShowSourceSelector(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to={`/movie/${id}`}
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

      {/* Source controls */}
      <div className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowSourceSelector(!showSourceSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              <span className="text-gray-400">Source:</span>
              <span className="font-medium">{embedInfo.sourceName}</span>
            </button>

            {showSourceSelector && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden min-w-[150px] z-20">
                {allSources.map((source) => (
                  <button
                    key={source.index}
                    onClick={() => handleSourceSelect(source.index)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                      source.index === sourceIndex
                        ? "text-[#3B82F6] bg-white/5"
                        : "text-white"
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleNextSource}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            <SkipForward className="w-4 h-4" />
            Try Next Source
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-4 text-center">
          If the video doesn't load or has issues, try switching to a different source.
        </p>
      </div>
    </div>
  );
};

export default WatchMovie;
