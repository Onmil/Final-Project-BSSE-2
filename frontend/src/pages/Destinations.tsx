import { useEffect, useState } from "react";
import "./Destinations.css";
import guim from "../assets/images/guim_2k.jpg";
import boracay from "../assets/images/bora.jpg";
import palawan from "../assets/images/palaw_2k.jpg";
import bacolod from "../assets/images/bcd_2k.png";
import islagigantes from "../assets/images/isla_2k.png";
import iloilo from "../assets/images/ilo_2k.png";
import { Tour, BookingData, TourSchedule, TourDate } from "../types";

const imageMap: Record<string, string> = {
  Guimaras: guim,
  Boracay: boracay,
  Palawan: palawan,
  Bacolod: bacolod,
  Iloilo: iloilo,
  "Isla Gigantes": islagigantes,
};


interface DestinationsPageProps {
  userId: string;
  bookings: BookingData[];
}

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  confirmed: { label: "Confirmed", bg: "#e6f9f2", color: "#0f7a52" },
  pending:   { label: "Pending",   bg: "#fff7e0", color: "#b07d00" },
  cancelled: { label: "Cancelled", bg: "#fdecea", color: "#c0392b" },
};

export default function DestinationsPage({ bookings }: DestinationsPageProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-PH", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const totalPrice = (booking: BookingData) => {
    const base = parseInt(booking.tour.price.replace(/[^\d]/g, "")) || 0;
    return `₱${(base * booking.persons).toLocaleString()}`;
  };

  const getTourImage = (title: string) => imageMap[title] || guim;

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
            const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
            const tourImage = getTourImage(booking.tour.name);

            return (
              <div key={booking.id} className="dest-card">
                <div className="dest-card-image">
                  <img src={tourImage} alt={booking.tour.name} />
                  <span className="dest-status-badge" style={{ background: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                </div>

                <div className="dest-card-info">
                  <h3 className="dest-card-title">{booking.tour.name}</h3>

                  <div className="dest-card-details">
                    <div className="dest-detail">
                      <span className="dest-detail-label">Date</span>
                      <span className="dest-detail-value">{formatDate(booking.date)}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Persons</span>
                      <span className="dest-detail-value">{booking.persons}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Name</span>
                      <span className="dest-detail-value">{booking.fullName}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Email</span>
                      <span className="dest-detail-value">{booking.email}</span>
                    </div>
                    <div className="dest-detail">
                      <span className="dest-detail-label">Phone</span>
                      <span className="dest-detail-value">{booking.phone}</span>
                    </div>
                  </div>

                  <div className="dest-card-footer">
                    <div>
                      <p className="dest-total-label">Total Paid</p>
                      <p className="dest-total-price">{totalPrice(booking)}</p>
                    </div>
                    <span className="dest-status-pill" style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}