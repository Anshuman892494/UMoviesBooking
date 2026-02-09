import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Layout from '../components/Layout';
import { fetchMovieById } from '../api/movieApi';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { selectedState, cinemas, loadCinemas, loadingCinemas } = useStore();

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await fetchMovieById(id);
                setMovie(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [id]);

    useEffect(() => {
        if (selectedState) {
            loadCinemas(selectedState);
        }
    }, [selectedState, loadCinemas]);

    if (loading) return <Layout><div className="text-center py-20 text-gray-600">Loading...</div></Layout>;
    if (!movie) return <Layout><div className="text-center py-20 text-gray-600">Movie not found</div></Layout>;

    const handleCinemaClick = (theatreId) => {
        navigate(`/movies/${id}/theatres/${theatreId}`);
    };

    return (
        <Layout>
            <div className="bg-gradient-to-b from-green-50 to-white">
                {/* Movie Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-64 rounded-xl shadow-2xl border-4 border-white/20"
                            onError={(e) => { e.target.src = 'https://placehold.co/300x450?text=No+Poster'; }}
                        />
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                            <div className="flex items-center gap-4 text-green-50 mb-6">
                                <span className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                                    <i className="fas fa-star text-yellow-300 mr-1"></i>
                                    <span className="font-semibold">{movie.rating}</span>
                                </span>
                                <span className="bg-white/20 px-3 py-1 rounded-full">{movie.year}</span>
                                <span className="bg-white/20 px-3 py-1 rounded-full">{movie.language}</span>
                            </div>
                            <p className="text-green-50 max-w-2xl text-lg leading-relaxed">{movie.plot || "No description available."}</p>
                        </div>
                    </div>
                </div>

                {/* Cinema Listing */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">
                        Available Cinemas {selectedState ? `in ${selectedState}` : ''}
                    </h2>

                    {loadingCinemas ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                        </div>
                    ) : cinemas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No cinemas found in this state.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cinemas.map(theatre => (
                                <div
                                    key={theatre.id}
                                    onClick={() => handleCinemaClick(theatre.id)}
                                    className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition">
                                                {theatre.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center mt-2">
                                                <i className="fas fa-map-marker-alt mr-1 text-green-600"></i>
                                                {theatre.location}, {theatre.city}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-green-600 font-semibold flex items-center justify-end group-hover:text-green-700 transition">
                                        Select Shows <i className="fas fa-calendar ml-2"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MovieDetail;
