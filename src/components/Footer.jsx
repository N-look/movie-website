import React from "react";
import { Film } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-gray-400 pt-20 border-t border-white/5 mt-12 bg-black/50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                Nflix
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Your ultimate destination for movies, TV shows, and anime. Stream your favorites in high quality.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full md:w-auto">
            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold text-white mb-1">Platform</h4>
              <Link to="/movies" className="text-sm hover:text-purple-400 transition-colors">Movies</Link>
              <Link to="/tv-shows" className="text-sm hover:text-purple-400 transition-colors">TV Shows</Link>
              <Link to="/anime" className="text-sm hover:text-purple-400 transition-colors">Anime</Link>
              <Link to="/top-rated" className="text-sm hover:text-purple-400 transition-colors">Top Rated</Link>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold text-white mb-1">Support</h4>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Help Center</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Cookie Policy</span>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold text-white mb-1">Company</h4>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">About Us</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Careers</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Partners</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Contact</span>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="font-semibold text-white mb-1">Connect</h4>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Twitter</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Instagram</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">Discord</span>
              <span className="text-sm hover:text-purple-400 transition-colors cursor-pointer">GitHub</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Nflix. All rights reserved.</p>
          <p>Made with ❤️ for movie lovers</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;