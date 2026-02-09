import React from 'react';

const SeatSelector = ({ selectedSeats, onSeatSelect, bookedSeats = [] }) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 10;
    const PRICE_PER_SEAT = 300;

    const getSeatId = (row, seatNum) => `${row}${seatNum}`;

    const isSeatBooked = (seatId) => bookedSeats.includes(seatId);
    const isSeatSelected = (seatId) => selectedSeats.includes(seatId);

    const handleSeatClick = (seatId) => {
        if (isSeatBooked(seatId)) return; // Can't select booked seats

        if (isSeatSelected(seatId)) {
            // Deselect
            onSeatSelect(selectedSeats.filter(s => s !== seatId));
        } else {
            // Select
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    const getSeatClass = (seatId) => {
        if (isSeatBooked(seatId)) {
            return 'bg-gray-300 cursor-not-allowed text-gray-500 border-gray-300';
        }
        if (isSeatSelected(seatId)) {
            return 'bg-gradient-to-br from-green-600 to-green-500 text-white cursor-pointer hover:from-green-700 hover:to-green-600 border-green-600 shadow-lg shadow-green-500/50';
        }
        return 'bg-white border-gray-300 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:shadow-lg hover:shadow-green-500/20 text-gray-600 hover:text-green-600';
    };

    return (
        <div className="w-full">
            {/* Screen */}
            <div className="mb-12">
                <div className="relative">
                    <div className="bg-gradient-to-b from-green-500/30 via-green-400/20 to-transparent h-3 rounded-t-[100px] mx-auto w-4/5 mb-3 shadow-lg shadow-green-500/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent blur-xl"></div>
                </div>
                <p className="text-center text-sm text-gray-600 font-semibold tracking-widest">SCREEN</p>
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col items-center gap-3 mb-10">
                {rows.map(row => (
                    <div key={row} className="flex items-center gap-3">
                        <span className="w-8 text-center font-bold text-gray-600 text-sm">{row}</span>
                        <div className="flex gap-2">
                            {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map(seatNum => {
                                const seatId = getSeatId(row, seatNum);
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        disabled={isSeatBooked(seatId)}
                                        className={`w-9 h-9 rounded-t-lg flex items-center justify-center text-xs font-medium transition-all duration-200 border-2 ${getSeatClass(seatId)}`}
                                        title={seatId}
                                    >
                                        <i className="fas fa-chair"></i>
                                    </button>
                                );
                            })}
                        </div>
                        <span className="w-8 text-center font-bold text-gray-600 text-sm">{row}</span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mb-8 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white border-2 border-gray-300 rounded-t-lg flex items-center justify-center">
                        <i className="fas fa-chair text-gray-600"></i>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-600 to-green-500 border-2 border-green-600 rounded-t-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                        <i className="fas fa-chair text-white"></i>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-300 border-2 border-gray-300 rounded-t-lg flex items-center justify-center">
                        <i className="fas fa-chair text-gray-500"></i>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Booked</span>
                </div>
            </div>

            {/* Selection Summary */}
            {selectedSeats.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-white border-2 border-green-500 rounded-2xl p-6 shadow-xl shadow-green-500/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-gray-700">Selected Seats:</span>
                        <span className="font-bold text-green-600 text-lg">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-4"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm text-gray-600">₹</span>
                            <span className="font-bold text-3xl bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                {selectedSeats.length * PRICE_PER_SEAT}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-600 text-center">
                        {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} × ₹{PRICE_PER_SEAT}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
