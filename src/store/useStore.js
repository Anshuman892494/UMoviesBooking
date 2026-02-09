import { create } from 'zustand';
import { fetchMovies, fetchStates, fetchCinemas } from '../api/movieApi';

const useStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    selectedState: localStorage.getItem('state') || null,
    movies: [],
    loadingMovies: false,
    states: [],
    loadingStates: false,
    cinemas: [],
    loadingCinemas: false,
    bookedSeats: JSON.parse(localStorage.getItem('bookedSeats') || '{}'), // { 'movieId-theatreId-date-time': ['A1', 'A2'] }

    // Authentication
    login: async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const { password, ...safeUser } = user;
            localStorage.setItem('user', JSON.stringify(safeUser));
            set({ user: safeUser, isAuthenticated: true });
            return true;
        } else {
            throw new Error('Invalid credentials');
        }
    },

    register: async (name, email, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after register
        const { password: _, ...safeUser } = newUser;
        localStorage.setItem('user', JSON.stringify(safeUser));
        set({ user: safeUser, isAuthenticated: true });
        return true;
    },

    logout: () => {
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },

    // State Logic
    setState: (state) => {
        localStorage.setItem('state', state);
        set({ selectedState: state });
    },

    loadStates: async () => {
        if (get().states.length > 0) return;
        set({ loadingStates: true });
        try {
            const data = await fetchStates();
            // Store full state objects {name, code, ...}
            set({ states: data, loadingStates: false });
        } catch (error) {
            console.error(error);
            set({ loadingStates: false });
        }
    },

    loadCinemas: async (stateName) => {
        if (!stateName) return;
        set({ loadingCinemas: true });
        try {
            const data = await fetchCinemas(stateName);
            set({ cinemas: data, loadingCinemas: false });
        } catch (error) {
            console.error(error);
            set({ loadingCinemas: false });
        }
    },

    // Movie Logic
    loadMovies: async () => {
        if (get().movies.length > 0) return; // Don't refetch if already loaded

        set({ loadingMovies: true });
        try {
            const data = await fetchMovies();
            set({ movies: data, loadingMovies: false });
        } catch (error) {
            console.error(error);
            set({ loadingMovies: false });
        }
    },

    // Booking Logic
    bookings: [],
    loadingBookings: false,

    loadBookings: async () => {
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 500));
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');

        // Filter by current user
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            const userBookings = allBookings.filter(b => b.user === userData.email);
            set({ bookings: userBookings });
        } else {
            set({ bookings: [] });
        }
    },

    // Seat Booking Logic
    getBookedSeats: (movieId, theatreId, date, time) => {
        const key = `${movieId}-${theatreId}-${date}-${time}`;
        return get().bookedSeats[key] || [];
    },

    bookSeats: (movieId, theatreId, date, time, seats) => {
        const key = `${movieId}-${theatreId}-${date}-${time}`;
        const currentBooked = get().bookedSeats;
        const updatedBooked = {
            ...currentBooked,
            [key]: [...(currentBooked[key] || []), ...seats]
        };
        localStorage.setItem('bookedSeats', JSON.stringify(updatedBooked));
        set({ bookedSeats: updatedBooked });
    },

    addBooking: (booking) => {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Update state if it matches current user
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && booking.user === userData.email) {
            const currentBookings = get().bookings;
            set({ bookings: [booking, ...currentBookings] });
        }
    }
}));

export default useStore;
