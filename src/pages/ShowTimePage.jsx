import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import Layout from '../components/Layout';
import { format, addDays } from 'date-fns';

const SHOWTIMES = [
    "10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM", "10:00 PM"
];

const ShowTimePage = () => {
    const { movieId, theatreId } = useParams();
    const navigate = useNavigate();
    const { movies, user, addBooking, cinemas, selectedState, loadCinemas, loadMovies } = useStore();

    useEffect(() => {
        // Ensure data is loaded if accessed directly
        if (cinemas.length === 0 && selectedState) {
            loadCinemas(selectedState);
        }
        if (movies.length === 0) {
            loadMovies();
        }
    }, [selectedState, cinemas.length, loadCinemas, movies.length, loadMovies]);

    // Find movie and theatre
    const movie = movies.find(m => m.id == movieId) || { title: "Loading...", poster: "" };
    const theatre = cinemas.find(t => t.id == theatreId) || { name: "Loading...", location: "" };

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [showTimer, setShowTimer] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const dates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));
    const PRICE_PER_TICKET = 300;

    // Countdown timer effect
    useEffect(() => {
        if (showTimer && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (showTimer && countdown === 0) {
            // Complete the booking after countdown
            completeBooking();
        }
    }, [showTimer, countdown]);

    const handleBooking = () => {
        if (!selectedTime || ticketCount < 1) return;

        if (!user) {
            navigate('/login');
            return;
        }

        // Start the countdown timer
        setShowTimer(true);
        setCountdown(5);
    };

    const completeBooking = () => {
        const booking = {
            id: Date.now(),
            user: user.email,
            movie: movie,
            theatre: theatre,
            date: selectedDate.toISOString(),
            time: selectedTime,
            seats: [], // No specific seats anymore
            ticketCount: ticketCount,
            status: 'Confirmed',
            totalAmount: ticketCount * PRICE_PER_TICKET
        };

        addBooking(booking);
        navigate('/booking-success', { state: { booking } });
    };

    const cancelBooking = () => {
        setShowTimer(false);
        setCountdown(5);
    };

    const incrementTickets = () => {
        if (ticketCount < 10) setTicketCount(ticketCount + 1);
    };

    const decrementTickets = () => {
        if (ticketCount > 1) setTicketCount(ticketCount - 1);
    };

    if (!selectedState) {
        // Fallback if state lost
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                    <p className="mb-4 text-gray-600">Please select a state first.</p>
                    <button onClick={() => navigate('/')} className="text-primary font-bold">Go to Home</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Select Date & Time</h1>
                <p className="text-gray-600 mb-8">{movie.title} @ {theatre.name}</p>

                {/* Date Selection */}
                <h3 className="font-bold mb-4 flex items-center text-gray-900"><i className="fas fa-calendar mr-2 text-green-600"></i> Select Date</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
                    {dates.map(date => (
                        <button
                            key={date.toString()}
                            onClick={() => {
                                setSelectedDate(date);
                            }}
                            className={`min-w-[100px] p-4 rounded-xl border-2 transition flex flex-col items-center ${format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white border-green-600 shadow-lg shadow-green-500/30'
                                : 'bg-white hover:border-green-500 border-gray-200 text-gray-700'
                                }`}
                        >
                            <span className="text-sm">{format(date, 'EEE')}</span>
                            <span className="text-xl font-bold">{format(date, 'd')}</span>
                            <span className="text-sm">{format(date, 'MMM')}</span>
                        </button>
                    ))}
                </div>

                {/* Time Selection */}
                <h3 className="font-bold mb-4 flex items-center text-gray-900"><i className="fas fa-clock mr-2 text-green-600"></i> Select Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {SHOWTIMES.map(time => (
                        <button
                            key={time}
                            onClick={() => {
                                setSelectedTime(time);
                            }}
                            className={`p-4 rounded-lg border font-medium transition ${selectedTime === time
                                ? 'bg-green-600 text-white border-green-600 shadow-md'
                                : 'bg-white hover:border-green-500 text-gray-700'
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                {/* Ticket Count Selection - Only show when time is selected */}
                {selectedTime && (
                    <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                        <h3 className="font-bold mb-6 flex items-center text-gray-900 text-lg">
                            <i className="fas fa-ticket-alt mr-2 text-green-600"></i> How many tickets?
                        </h3>
                        
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-full border border-gray-200">
                                <button 
                                    onClick={decrementTickets}
                                    disabled={ticketCount <= 1}
                                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <span className="text-2xl font-bold w-8 text-center text-gray-900">{ticketCount}</span>
                                <button 
                                    onClick={incrementTickets}
                                    disabled={ticketCount >= 10}
                                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-gray-500 text-sm">Total Amount</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg text-gray-400">₹</span>
                                    <span className="text-4xl font-bold text-green-600">{ticketCount * PRICE_PER_TICKET}</span>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{ticketCount} x ₹{PRICE_PER_TICKET}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm Action */}
                <div className="flex justify-end">
                    <button
                        onClick={handleBooking}
                        disabled={!selectedTime}
                        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-full font-bold flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-600 transition shadow-lg shadow-green-500/30"
                    >
                        Confirm Booking <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>

                {/* Countdown Timer Modal */}
                {showTimer && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-green-500 animate-in fade-in zoom-in duration-300">
                            <div className="text-center">
                                <div className="mb-6">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                                        <span className="text-5xl font-bold text-white">{countdown}</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Booking</h3>
                                <p className="text-gray-600 mb-6">
                                    Your booking will be confirmed in {countdown} second{countdown !== 1 ? 's' : ''}...
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={cancelBooking}
                                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ShowTimePage;
