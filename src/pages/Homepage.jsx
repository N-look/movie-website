import React from 'react'
import Hero from '../components/Hero'
import CardList from '../components/CardList'
import Footer from '../components/Footer'

const Homepage = () => {
  return (
    <div className='min-h-screen bg-[#0b0b0b] relative overflow-x-hidden'>
        {/* Ambient Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Hero />
          <div className="px-4 md:px-8 pb-16 space-y-12">
            <div className="-mt-32 relative z-20">
              <CardList title="Now Playing Movies" category="now_playing" />
            </div>
            <CardList title="Top Rated Movies" category="top_rated" />
            <CardList title="Popular Movies" category="popular" />
            <CardList title="Trending TV Shows" category="popular" mediaType="tv" />
          </div>
          <Footer />
        </div>
    </div>
  )
}

export default Homepage