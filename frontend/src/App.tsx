import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import ToursPage from "./pages/Tours";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import BookingForm, { BookingData } from "./components/Bookingform";
import { tourSchedules } from "./data/tourDates";

type Page = "home" | "tours";

interface User {
  name: string;
  email: string;
}

interface Tour {
  id: number;           // matches tours.id in Supabase
  name: string;         // matches tours.name
  price: string;        // formatted string, e.g., "₱5000"
  image?: string;       // optional if you store images
  description?: string; // optional
  duration?: string;    // optional
}

function App() {
  const [modalType, setModalType] = useState<"login" | "signup" | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(null);
  const [bookingTour, setBookingTour] = useState<Tour | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [schedules, setSchedules] = useState(tourSchedules);

  const isLoggedIn = user !== null;

  const handleGoToTours = () => {
    if (isLoggedIn) setCurrentPage("tours");
    else setModalType("signup");
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setModalType(null);
    setCurrentPage("tours");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const handleNavigate = (page: Page) => {
    if (page === "tours") handleGoToTours();
    else setCurrentPage("home");
  };

  const handleConfirmBooking = (booking: BookingData) => {
    setBookings((prev) => [...prev, booking]);
    setSchedules((prev) => {
      const updated = { ...prev };
      const tourDates = updated[booking.tour.title];
      if (tourDates) {
        updated[booking.tour.title] = tourDates.map((d) =>
          d.date === booking.date
            ? { ...d, spotsLeft: Math.max(0, d.spotsLeft - booking.persons) }
            : d
        );
      }
      return updated;
    });
    setBookingTour(null);
  };

  return (
    <>
      <Navbar
        onLoginClick={() => setModalType("login")}
        onSignupClick={() => setModalType("signup")}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        user={user}
        onLogout={handleLogout}
      />

      {currentPage === "home" && <LandingPage onExplore={handleGoToTours} />}
      {currentPage === "tours" && (
        <ToursPage onBook={(tour) => setBookingTour(tour)} />
      )}

      {modalType && (
        <Modal
          type={modalType}
          onClose={() => setModalType(null)}
          onSwitch={(t) => setModalType(t)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {bookingTour && (
        <BookingForm
          tour={bookingTour}
          onClose={() => setBookingTour(null)}
          onConfirm={handleConfirmBooking}
          schedules={schedules}
          userId={user?.email ?? "guest"}
        />
      )}
    </>
  );
}

export default App;