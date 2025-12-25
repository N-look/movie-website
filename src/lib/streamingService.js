/**
 * ============================================================
 * EMBED SOURCES CONFIGURATION
 * ============================================================
 * 
 * HOW TO ADD A NEW SOURCE:
 * 
 * 1. Add a new object to the EMBED_SOURCES array below
 * 2. Each source needs:
 *    - name: Display name for the source
 *    - movieUrl: Function that takes (tmdbId) and returns the embed URL
 *    - tvUrl: Function that takes (tmdbId, season, episode) and returns the embed URL
 *    - sandbox: true if iframe sandbox works (blocks ads), false if it breaks the player
 *    - hasAds: true if the source has pop-up ads
 */

const EMBED_SOURCES = [
  {
    name: "vidsrc.cc",
    movieUrl: (tmdbId) => `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) => `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`,
    sandbox: true,  // Sandbox works - blocks ads
    hasAds: false,
  },
  {
    name: "videasy",
    movieUrl: (tmdbId) => `https://player.videasy.net/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) => `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
    sandbox: false, // Sandbox breaks player
    hasAds: true,
  },
  {
    name: "vidsrc.to",
    movieUrl: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) => `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
    sandbox: false,  // Sandbox works - blocks ads
    hasAds: true,
  },
  {
    name: "vidsrc.su",
    movieUrl: (tmdbId) => `https://vidsrc.su/movie/${tmdbId}`,
    tvUrl: (tmdbId, season, episode) => `https://vidsrc.su/tv/${tmdbId}/${season}/${episode}`,
    sandbox: false, // Sandbox breaks player
    hasAds: true,
  },
  
  // ============================================================
  // ADD NEW SOURCES BELOW - Copy this template:
  // ============================================================
  // {
  //   name: "source-name",
  //   movieUrl: (tmdbId) => `https://example.com/movie/${tmdbId}`,
  //   tvUrl: (tmdbId, season, episode) => `https://example.com/tv/${tmdbId}/${season}/${episode}`,
  //   sandbox: false, // Test if sandbox works without breaking player
  //   hasAds: true,   // Set to true if source has pop-up ads
  // },
];

// ============================================================
// HELPER FUNCTIONS - No need to modify these
// ============================================================

export function getMovieEmbed(tmdbId, sourceIndex = 0) {
  const source = EMBED_SOURCES[sourceIndex] || EMBED_SOURCES[0];
  return {
    url: source.movieUrl(tmdbId),
    sourceName: source.name,
    sourceIndex,
    totalSources: EMBED_SOURCES.length,
    sandbox: source.sandbox,
    hasAds: source.hasAds,
  };
}

export function getTvShowEmbed(tmdbId, season, episode, sourceIndex = 0) {
  const source = EMBED_SOURCES[sourceIndex] || EMBED_SOURCES[0];
  return {
    url: source.tvUrl(tmdbId, season, episode),
    sourceName: source.name,
    sourceIndex,
    totalSources: EMBED_SOURCES.length,
    sandbox: source.sandbox,
    hasAds: source.hasAds,
  };
}

export function getNextSourceIndex(currentIndex) {
  return (currentIndex + 1) % EMBED_SOURCES.length;
}

export function getAllSources() {
  return EMBED_SOURCES.map((s, i) => ({ name: s.name, index: i, hasAds: s.hasAds }));
}
