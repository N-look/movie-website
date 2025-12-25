import { Play, Clock, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Check if a date is in the future
const isUnreleased = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) > new Date();
};

const Moviepage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => setMovie(res))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setRecommendations(res.results || []))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        const trailer = res.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-red-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white relative overflow-x-hidden">
      {/* Ambient Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div
        className="relative h-[70vh] flex items-end pb-16 z-10"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/80 via-transparent to-transparent"></div>

        <div className="relative z-10 container mx-auto px-4 flex gap-8 items-end">
          <div className="hidden md:block flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              className="rounded-2xl shadow-2xl w-64 border-2 border-white/10"
              alt={movie.title}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-2xl">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-200">
              <span className="flex items-center gap-1 text-yellow-400 font-medium">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
              <span>•</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="max-w-2xl text-gray-200 mb-6 text-base leading-relaxed line-clamp-3">{movie.overview}</p>
            <div className="flex flex-wrap gap-4">
              {isUnreleased(movie.release_date) ? (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 py-3 px-6 rounded-2xl text-sm md:text-base font-medium">
                  <Clock className="w-5 h-5" />
                  Not Yet Released
                </div>
              ) : (
                <Link to={`/watch/movie/${movie.id}`}>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
                    <Play className="w-5 h-5 mr-2" /> Play
                  </button>
                </Link>
              )}
              {trailerKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
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

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Details</h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl shadow-xl p-6 flex flex-col md:flex-row gap-8 border border-white/5">
          <div className="flex-1">
            <ul className="text-gray-300 space-y-3">
              <li>
                <span className="font-semibold text-white">Status: </span>
                <span className="ml-2">{movie.status}</span>
              </li>

              <li>
                <span className="font-semibold text-white">Release Date: </span>
                <span className="ml-2">{movie.release_date}</span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Original Language:
                </span>
                <span className="ml-2">
                  {movie.original_language?.toUpperCase()}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Budget: </span>
                <span className="ml-2">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Revenue:</span>{" "}
                <span className="ml-2">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Production Companies:
                </span>
                <span className="ml-2">
                  {movie.production_companies &&
                    movie.production_companies.length > 0
                    ? movie.production_companies.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">Countries:</span>
                <span className="ml-2">
                  {movie.production_countries &&
                    movie.production_countries.length > 0
                    ? movie.production_countries.map((c) => c.name).join(", ")
                    : "N/A"}
                </span>
              </li>

              <li>
                <span className="font-semibold text-white">
                  Spoken Languages:
                </span>
                <span className="ml-2">
                  {movie.spoken_languages && movie.spoken_languages.length > 0
                    ? movie.spoken_languages
                      .map((l) => l.english_name)
                      .join(", ")
                    : "N/A"}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="italic text-gray-400 mb-6">
              {movie.tagline || "No tagline available."}
            </p>

            <h3 className="font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-200">{movie.overview}</p>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4">
            You might also like...
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.slice(0, 10).map((rec) => (
              <div
                key={rec.id}
                className="group"
              >
                <Link to={`/movie/${rec.id}`} className="block">
                  <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-3">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">{rec.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>
                      {rec.release_date?.slice(0, 4)}
                    </span>
                    <span>•</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                      <span>{rec.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Moviepage;