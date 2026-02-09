import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    if (!booking) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <i className="fas fa-ticket-alt text-6xl text-green-300 mb-4"></i>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Booking Found</h2>
                    <p className="text-gray-600 mb-8">It seems you haven't selected a ticket yet.</p>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition shadow-lg shadow-green-500/30"
                    >
                        Browse Movies
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-center p-8 border-2 border-green-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 rounded-full p-4">
                            <i className="fas fa-check-circle text-6xl text-green-600"></i>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600 mb-8">Your ticket has been successfully booked.</p>

                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 mb-8 text-left border-2 border-green-200">
                        <div className="flex gap-4 mb-6">
                            <img
                                src={booking.movie.poster}
                                alt="Poster"
                                className="w-20 h-28 object-cover rounded-lg shadow-md"
                            />
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{booking.movie.title}</h3>
                                <div className="text-sm text-gray-600 space-y-1.5">
                                    <p className="flex items-center">
                                        <i className="fas fa-map-marker-alt mr-2 text-green-600"></i>
                                        {booking.theatre.name}
                                    </p>
                                    <p className="flex items-center">
                                        <i className="fas fa-calendar mr-2 text-green-600"></i>
                                        {new Date(booking.date).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center">
                                        <i className="fas fa-clock mr-2 text-green-600"></i>
                                        {booking.time}
                                    </p>
                                    <p className="flex items-center mt-2">
                                        <span className="font-semibold mr-2">Tickets:</span>
                                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                            {booking.ticketCount || (booking.seats ? booking.seats.length : 1)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 border-dashed border-green-300 pt-4 flex justify-between items-center">
                            <span className="text-gray-700 font-semibold">Total Paid</span>
                            <span className="text-2xl font-bold text-green-600">₹{booking.totalAmount}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-600 transition shadow-lg shadow-green-500/30"
                        >
                            View My Bookings
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-600 font-medium py-2 hover:text-green-600 transition"
                        >
                            Book Another Ticket
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BookingPage;
