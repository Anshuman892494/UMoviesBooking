import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Layout from '../components/Layout';

const Home = () => {
    const {
        movies, loadMovies, loadingMovies,
        selectedState, setState,
        states, loadStates,
        loadingStates
    } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const categories = ['Bollywood', 'Marvel', 'DC', 'Hollywood', 'Animation', 'Tollywood'];

    // Load states on mount
    useEffect(() => {
        loadMovies();
        loadStates();
    }, [loadMovies, loadStates]);

    // Set default state if none selected
    useEffect(() => {
        if (!selectedState && states.length > 0) {
            setState(states[0].code);
        }
    }, [selectedState, setState, states]);

    const handleMovieClick = (movieId) => {
        if (!selectedState) {
            alert("Please select a state first");
            return;
        }
        navigate(`/movies/${movieId}`);
    };

    // Group movies by category
    const moviesByCategory = categories.reduce((acc, category) => {
        acc[category] = movies.filter(movie => movie.category === category);
        return acc;
    }, {});

    // Get featured movies for slideshow (first 5 movies with valid posters)
    const featuredMovies = movies.filter(m => m.poster && m.poster !== 'N/A').slice(0, 5);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slideshow every 5 seconds
    useEffect(() => {
        if (featuredMovies.length > 1 && !searchTerm) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(interval);
        }
    }, [featuredMovies.length, searchTerm]);

    const featuredMovie = featuredMovies[currentSlide] || movies[0];

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Filter movies for search
    const searchResults = searchTerm
        ? movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : null;

    const MovieRow = ({ title, movies }) => {
        const scrollRef = React.useRef(null);

        const scroll = (direction) => {
            if (scrollRef.current) {
                const scrollAmount = direction === 'left' ? -800 : 800;
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        };

        if (!movies || movies.length === 0) return null;

        return (
            <div className="mb-6 relative group">
                <h2 className="text-xl font-bold text-gray-900 mb-3 px-4 md:px-8">{title}</h2>

                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-green-600 p-2 rounded-r shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-green-200"
                >
                    <i className="fas fa-chevron-left text-2xl"></i>
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-green-600 p-2 rounded-l shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-green-200"
                >
                    <i className="fas fa-chevron-right text-2xl"></i>
                </button>

                {/* Movie Cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => handleMovieClick(movie.id)}
                            className="flex-shrink-0 w-48 cursor-pointer group/card transition-transform hover:scale-105"
                        >
                            <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20 transition-all">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-72 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 p-3 w-full">
                                        <div className="flex items-center gap-2 mb-1">
                                            <i className="fas fa-star text-yellow-400"></i>
                                            <span className="text-white text-sm font-semibold">{movie.rating}</span>
                                        </div>
                                        <i className="fas fa-play text-white"></i>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-gray-900 text-sm font-medium mt-2 truncate">{movie.title}</h3>
                            <p className="text-gray-600 text-xs">{movie.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 overflow-x-hidden">
                {/* Header with Search and Location */}
                <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm w-full">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex gap-4 items-center">
                        {/* State Selector */}
                        <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-48">
                            <i className="fas fa-map-marker-alt text-green-600 mr-2"></i>
                            <select
                                value={selectedState || ''}
                                onChange={(e) => setState(e.target.value)}
                                className="bg-transparent border-none outline-none text-gray-900 w-full cursor-pointer text-sm"
                            >
                                <option value="" disabled>Select State</option>
                                {states.map(state => (
                                    <option key={state.code} value={state.code} className="bg-white">{state.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search movies..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Banner */}
                {!searchTerm && featuredMovie && (
                    <div className="relative h-[60vh] mb-6 bg-gradient-to-r from-green-50 to-white overflow-hidden">
                        {/* Slideshow Images */}
                        {featuredMovies.map((movie, index) => (
                            <div
                                key={movie.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover opacity-30"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            </div>
                        ))}

                        {/* Content */}
                        <div className="relative h-full flex items-end px-4 md:px-8 pb-12">
                            <div className="max-w-2xl">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 transition-all duration-500">
                                    {featuredMovie.title}
                                </h1>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-star text-yellow-500"></i>
                                        <span className="text-gray-900 font-semibold">{featuredMovie.rating}</span>
                                    </div>
                                    <span className="text-gray-700 text-sm">{featuredMovie.year}</span>
                                    <span className="text-gray-700 text-sm">{featuredMovie.language}</span>
                                </div>
                                <p className="text-gray-700 text-sm md:text-base mb-4 line-clamp-2 transition-all duration-500">
                                    {featuredMovie.plot}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleMovieClick(featuredMovie.id)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition shadow-lg shadow-green-500/30"
                                    >
                                        <i className="fas fa-ticket-alt mr-2"></i>
                                        Book Now
                                    </button>
                                    <button
                                        onClick={() => handleMovieClick(featuredMovie.id)}
                                        className="flex items-center gap-2 bg-white border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
                                    >
                                        <i className="fas fa-info-circle"></i>
                                        More Info
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Dots */}
                        {featuredMovies.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                                {featuredMovies.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                            ? 'bg-green-600 w-8'
                                            : 'bg-gray-400 hover:bg-gray-600'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Search Results or Category Rows */}
                <div className="pb-8">
                    {searchResults ? (
                        <div className="px-4 md:px-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {searchResults.map((movie) => (
                                    <div
                                        key={movie.id}
                                        onClick={() => handleMovieClick(movie.id)}
                                        className="cursor-pointer group transition-transform hover:scale-105"
                                    >
                                        <div className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20 transition-all">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="w-full h-72 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 p-3 w-full">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-star text-yellow-400"></i>
                                                        <span className="text-white text-sm font-semibold">{movie.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-gray-900 text-sm font-medium mt-2 truncate">{movie.title}</h3>
                                        <p className="text-gray-600 text-xs">{movie.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {categories.map(category => (
                                <MovieRow
                                    key={category}
                                    title={category}
                                    movies={moviesByCategory[category]}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Loading State */}
                {loadingMovies && (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-900 text-xl">Loading movies...</div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </Layout>
    );
};

export default Home;
