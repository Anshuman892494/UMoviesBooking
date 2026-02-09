import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import MovieDetail from './pages/MovieDetail';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import ShowTimePage from './pages/ShowTimePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/:city/movies" element={<CityMovies />} /> */}
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/:movieId/theatres/:theatreId" element={<ShowTimePage />} />
        <Route path="/booking-success" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
