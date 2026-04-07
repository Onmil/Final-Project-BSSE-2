import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import ToursPage from "./pages/Tours";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import BookingForm from "./components/Bookingform";
import { tourSchedules } from "./data/tourDates";
import DestinationsPage from "./pages/Destinations";
import { Tour, BookingData, TourSchedule } from "./types";

type Page = "home" | "tours" | "destinations";

interface User {
  id: string; // UUID from Supabase
  name: string;
  email: string;
}

function App() {
  const [modalType, setModalType] = useState<"login" | "signup" | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(null);
  const [bookingTour, setBookingTour] = useState<Tour | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [schedules, setSchedules] = useState<TourSchedule>(tourSchedules);

  const isLoggedIn = user !== null;

  const handleGoToTours = () => {
    if (isLoggedIn) setCurrentPage("tours");
    else setModalType("signup");
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setModalType(null);

    if (currentPage === "destinations") {
      setCurrentPage("home");
      setTimeout(() => setCurrentPage("destinations"), 0);
    } else {
      setCurrentPage("tours");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const handleNavigate = (page: Page) => {
    if (page === "tours") handleGoToTours();
    else setCurrentPage(page);
  };

  const handleConfirmBooking = (booking: BookingData) => {
    setSchedules((prev) => {
      const updated = { ...prev };
      const tourDates = updated[booking.tour.name];
      if (tourDates) {
        updated[booking.tour.name] = tourDates.map((d) =>
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
      {currentPage === "destinations" && (
        <DestinationsPage userId={user?.id ?? null } />
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
          userUuid={user?.id ?? null} // Pass UUID instead of email
          onGoToDestinations={() => setCurrentPage("destinations")}
        />
      )}
    </>
  );
}

export default App;