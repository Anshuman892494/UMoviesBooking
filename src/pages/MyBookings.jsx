import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useStore from '../store/useStore';

const MyBookings = () => {
    const { user, bookings, loadBookings } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadBookings();
    }, [user, navigate, loadBookings]);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">View and manage your movie bookings</p>
                </div>

                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-md border-2 border-green-100">
                            <i className="fas fa-ticket-alt text-6xl mx-auto text-green-300 mb-4"></i>
                            <p className="text-gray-600 mb-6 text-lg">No bookings found.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition shadow-lg shadow-green-500/30"
                            >
                                Book a Ticket
                            </button>
                        </div>
                    ) : (
                        bookings.map(booking => (
                            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 hover:border-green-500 transition-all flex flex-col md:flex-row gap-6">
                                <div className="w-24 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                                    <img src={booking.movie.poster} className="w-full h-full object-cover" alt="Poster" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-xl mb-1 text-gray-900">{booking.movie.title}</h3>
                                    <p className="text-gray-600 mb-4 flex items-center">
                                        <i className="fas fa-map-marker-alt mr-1 text-green-600"></i> {booking.theatre.name}, {booking.theatre.city}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">Date & Time</p>
                                            <p className="flex items-center">
                                                <i className="fas fa-calendar mr-1 text-green-600"></i> {new Date(booking.date).toLocaleDateString()}
                                                <span className="mx-2">|</span>
                                                <i className="fas fa-clock mr-1 text-green-600"></i> {booking.time}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">Tickets</p>
                                            <p className="font-semibold text-gray-900">
                                                {booking.ticketCount || (booking.seats ? booking.seats.length : 'N/A')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {booking.status}
                                        </span>
                                        <p className="text-right">
                                            <span className="text-gray-500 text-sm">Total Amount</span>
                                            <span className="block font-bold text-2xl text-green-600">₹{booking.totalAmount}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MyBookings;
