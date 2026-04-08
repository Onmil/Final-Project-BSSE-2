import { useEffect, useState } from "react";
import "./Destinations.css";
import guim from "../assets/images/guim_2k.jpg";
import boracay from "../assets/images/bora.jpg";
import palawan from "../assets/images/palaw_2k.jpg";
import bacolod from "../assets/images/bcd_2k.png";
import islagigantes from "../assets/images/isla_2k.png";
import iloilo from "../assets/images/ilo_2k.png";
import { supabase } from "../supabaseClient";
import { ITINERARIES } from "../data/Itineraries";

const imageMap: Record<string, string> = {
  Guimaras: guim,
  Boracay: boracay,
  Palawan: palawan,
  Bacolod: bacolod,
  Iloilo: iloilo,
  "Isla Gigantes": islagigantes,
};

const TOUR_MAP: Record<number, { name: string; price: string }> = {
  1: { name: "Guimaras", price: "₱2,500" },
  2: { name: "Boracay", price: "₱4,500" },
  3: { name: "Palawan", price: "₱5,500" },
  4: { name: "Iloilo", price: "₱2,500" },
  5: { name: "Bacolod", price: "₱3,000" },
  6: { name: "Isla Gigantes", price: "₱3,500" },
  101: { name: "BGPS Explorer", price: "₱18,500" },
  102: { name: "Island Duo", price: "₱9,500" },
  103: { name: "Islands & Scallops", price: "₱7,000" },
  104: { name: "Iloilo & Guimaras", price: "₱5,500" },
  105: { name: "Iloilo & Bacolod", price: "₱6,000" },
  106: { name: "Visayas Grand Tour", price: "₱14,500" },
};

const PAYMENT_LABELS: Record<string, { icon: string; label: string }> = {
  gcash:          { icon: "💙", label: "GCash" },
  maya:           { icon: "💚", label: "Maya" },
  card:           { icon: "💳", label: "Credit / Debit Card" },
  pay_on_arrival: { icon: "🤝", label: "Pay on Arrival" },
};

interface BookingRow {
  id: number;
  tour_id: number;
  booking_date: string;
  status: string;
  full_name: string;
  email: string;
  phone: string;
  persons: number;
  user_id: string;
  payment_method: string | null;
}

interface DestinationsPageProps {
  userId: string | null;
  refreshKey?: number;
}

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  confirmed: { label: "Confirmed", bg: "#e6f9f2", color: "#0f7a52" },
  pending:   { label: "Pending",   bg: "#fff7e0", color: "#b07d00" },
  cancelled: { label: "Cancelled", bg: "#fdecea", color: "#c0392b" },
};

interface ItineraryModalProps {
  bookingId: number | null;
  tourName: string;
  tourImage: string;
  onClose: () => void;
}

function ItineraryModal({ bookingId, tourName, tourImage, onClose }: ItineraryModalProps) {
  if (bookingId === null) return null;
  const itinerary = ITINERARIES[bookingId];
  if (!itinerary) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="itin-backdrop" onClick={handleBackdropClick}>
      <div className="itin-modal">
        <div className="itin-modal-hero">
          <img src={tourImage} alt={tourName} />
          <div className="itin-modal-hero-overlay">
            <p className="itin-modal-eyebrow">🗓 Itinerary</p>
            <h2 className="itin-modal-title">{tourName}</h2>
          </div>
          <button className="itin-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="itin-modal-body">
          <div className="itin-meetup-row">
            <div className="itin-meetup-chip">
              <span className="itin-meetup-icon">⏰</span>
              <div>
                <p className="itin-meetup-label">Meet-up Time</p>
                <p className="itin-meetup-value">{itinerary.meetupTime}</p>
              </div>
            </div>
            <div className="itin-meetup-chip">
              <span className="itin-meetup-icon">📍</span>
              <div>
                <p className="itin-meetup-label">Meet-up Place</p>
                <p className="itin-meetup-value">{itinerary.meetupPlace}</p>
              </div>
            </div>
          </div>

          <div className="itin-days">
            {itinerary.days.map((day, dayIdx) => (
              <div key={dayIdx} className="itin-day">
                <div className="itin-day-header">
                  <span className="itin-day-badge">{day.day}</span>
                  <span className="itin-day-title">{day.title}</span>
                </div>
                <div className="itin-timeline">
                  {day.activities.map((act, actIdx) => (
                    <div key={actIdx} className="itin-timeline-item">
                      <div className="itin-timeline-dot" />
                      <div className="itin-timeline-content">
                        <span className="itin-timeline-time">{act.time}</span>
                        <span className="itin-timeline-activity">{act.activity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DestinationsPage({ userId, refreshKey = 0 }: DestinationsPageProps) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalBooking, setModalBooking] = useState<BookingRow | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setBookings([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } else {
        setBookings((data as BookingRow[]) || []);
      }

      setLoading(false);
    };

    fetchBookings();
  }, [userId, refreshKey]);

  useEffect(() => {
    document.body.style.overflow = modalBooking ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalBooking]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-PH", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const totalPrice = (booking: BookingRow) => {
    const tour = TOUR_MAP[booking.tour_id];
    const base = parseInt(tour?.price?.replace(/[^\d]/g, "") || "0", 10);
    return `₱${(base * booking.persons).toLocaleString()}`;
  };

  const getTourImage = (name: string) => imageMap[name] || guim;

  return (
    <div className="dest-page">
      <div className="dest-header">
        <p className="dest-eyebrow">YOUR TRAVEL PLANS</p>
        <h1 className="dest-title">My Destinations</h1>
        <p className="dest-subtitle">All your booked tours in one place.</p>
      </div>

      {loading && (
        <div className="dest-state">
          <div className="dest-spinner" />
          <p>Loading your bookings...</p>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="dest-state dest-empty">
          <div className="dest-empty-icon">🗺️</div>
          <h3>No bookings yet</h3>
          <p>Head to Tours and book your first adventure!</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="dest-grid">
          {bookings.map((booking) => {
            const tourName = TOUR_MAP[booking.tour_id]?.name || "Unknown Tour";
            const tourImage = getTourImage(tourName);
            const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
            const hasItinerary = !!ITINERARIES[booking.tour_id];
            const payment = booking.payment_method
              ? PAYMENT_LABELS[booking.payment_method]
              : null;

            return (
              <div key={booking.id} className="dest-card">
                <div className="dest-card-image">
                  <img src={tourImage} alt={tourName} />
                  <span
                    className="dest-status-badge"
                    style={{ background: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="dest-card-info">
                  <h3 className="dest-card-title">{tourName}</h3>

                  <div className="dest-card-details">
                    <div className="dest-detail">
                      <span className="dest-detail-label">Date</span>
                      <span className="dest-detail-value">{formatDate(booking.booking_date)}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Persons</span>
                      <span className="dest-detail-value">{booking.persons}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Name</span>
                      <span className="dest-detail-value">{booking.full_name}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Email</span>
                      <span className="dest-detail-value">{booking.email}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Phone</span>
                      <span className="dest-detail-value">{booking.phone}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Payment</span>
                      <span className="dest-payment-value">
                        {payment ? (
                          <>
                            <span className="dest-payment-icon">{payment.icon}</span>
                            {payment.label}
                          </>
                        ) : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="dest-card-footer">
                    <div>
                      <p className="dest-total-label">
                        {booking.status === "confirmed"
                          ? "Total Paid"
                          : booking.status === "pending"
                          ? "Total Due"
                          : "Total"}
                      </p>
                      <p className="dest-total-price">{totalPrice(booking)}</p>
                    </div>
                    <span
                      className="dest-status-pill"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {hasItinerary && (
                    <button
                      className="dest-itinerary-btn"
                      onClick={() => setModalBooking(booking)}
                    >
                      <span>🗓</span>
                      <span>View Itinerary</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalBooking && (
        <ItineraryModal
          bookingId={modalBooking.tour_id}
          tourName={TOUR_MAP[modalBooking.tour_id]?.name || "Tour"}
          tourImage={getTourImage(TOUR_MAP[modalBooking.tour_id]?.name || "")}
          onClose={() => setModalBooking(null)}
        />
      )}
    </div>
  );
}