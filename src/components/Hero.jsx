import { Bookmark, Play } from "lucide-react";
import HeroBg from "../assets/herobg2.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router";
const Hero = () => {
  const [movie, setMovie] = useState(null);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }
  return (
    <div className="relative w-full h-[70vh] md:h-[85vh]">
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt="bg-img"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/80 via-transparent to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-40 md:pb-48 flex flex-col items-start gap-6 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl drop-shadow-2xl leading-tight">
          {movie.title}
        </h1>
        <p className="text-gray-200 max-w-2xl line-clamp-3 text-sm md:text-lg drop-shadow-md">
          {movie.overview}
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-semibold hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 group">
            <Bookmark className="w-5 h-5 group-hover:text-purple-400 transition-colors" /> 
            Save for Later
          </button>
          
          <Link to={`/watch/movie/${movie.id}`}>
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Play className="w-5 h-5 fill-current relative z-10" /> 
              <span className="relative z-10">Watch Now</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
