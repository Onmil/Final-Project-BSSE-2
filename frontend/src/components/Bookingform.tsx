import { useState } from "react";
import "./Bookingform.css";
import { formatDate } from "../data/tourDates";
import { Tour, BookingData, TourSchedule, TourDate } from "../types";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

interface Tour {
  title: string;
  price: string;
  image: string;
  id?: number;
}

interface BookingFormProps {
  tour: Tour;
  onClose: () => void;
  onConfirm: (booking: BookingData) => void;
  schedules: TourSchedule;
  userId: number;
  onGoToDestinations: () => void;
}

export interface BookingData {
  id: string;
  tour: Tour;
  fullName: string;
  email: string;
  phone: string;
  persons: number;
  date: string;
  status: "confirmed";
  userUuid?: string | null; // <-- optional UUID
}

type Step = "form" | "success";

export default function BookingForm({ tour, onClose, onConfirm, schedules, userUuid }: BookingFormProps) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    persons: 1,
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const dates: TourDate[] = schedules[tour.name] ?? [];
  const selectedDate = dates.find((d) => d.date === form.date);
  const maxPersons = selectedDate ? selectedDate.spotsLeft : 40;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" && form.persons > (dates.find((d) => d.date === value)?.spotsLeft ?? 40)
        ? { persons: 1 }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const tourId = Number(tour.id);
      if (isNaN(tourId)) throw new Error("Invalid tour selected");

      const payload = {
        user_uuid: userUuid ?? null, // <-- correct UUID sent
        tour_id: tour.id,
        booking_date: form.date,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        persons: Number(form.persons),
        status: "confirmed",
      };

      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || response.statusText || "Booking request failed");
      }

      const booking: BookingData = {
        id: crypto.randomUUID(),
        tour,
        ...form,
        persons: Number(form.persons),
        status: "confirmed",
      };

      onConfirm(booking);
      setStep("success");
    } catch (error: any) {
      setSubmitError(error?.message || "Unable to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = () => {
    const base = parseInt(tour.price.replace(/[^\d]/g, ""));
    return `₱${(base * form.persons).toLocaleString()}`;
  };

  return (
    <div className="bf-overlay" onClick={step === "success" ? onClose : undefined}>
      {step === "success" && (
        <div className="bf-confetti-wrap" aria-hidden>
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="bf-confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: ["#5bb8a0", "#ffd700", "#ff6b6b", "#74b9ff", "#a29bfe", "#fd79a8"][i % 6],
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }} />
          ))}
        </div>
      )}

      {step === "form" && (
        <div className="bf-box" onClick={(e) => e.stopPropagation()}>
          <div className="bf-header" style={{ backgroundImage: `url(${tour.image ?? "fallback.png"})` }}>
            <div className="bf-header-overlay" />
            <div className="bf-header-content">
              <h2 className="bf-tour-name">{tour.name}</h2>
              <p className="bf-tour-price">{tour.price} / person</p>
            </div>
            <button className="bf-close" onClick={onClose}>✕</button>
          </div>

          <form onSubmit={handleSubmit} className="bf-form">
            <div className="bf-row">
              <div className="bf-field">
                <label>Full Name</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="bf-field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="bf-row">
              <div className="bf-field">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div className="bf-field">
                <label>Available Date</label>
                <select name="date" value={form.date} onChange={handleChange} required>
                  <option value="">Select a date</option>
                  {dates.map((d) => (
                    <option key={d.date} value={d.date} disabled={d.spotsLeft === 0}>
                      {formatDate(d.date)} — {d.spotsLeft === 0 ? "Full" : `${d.spotsLeft} spots left`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bf-field">
              <label>Number of Persons{selectedDate && ` (max ${selectedDate.spotsLeft})`}</label>
              <div className="bf-counter">
                <button type="button" onClick={() => setForm(f => ({ ...f, persons: Math.max(1, f.persons - 1) }))}>−</button>
                <span>{form.persons}</span>
                <button type="button" onClick={() => setForm(f => ({ ...f, persons: Math.min(maxPersons, f.persons + 1) }))}>+</button>
              </div>
            </div>

            <div className="bf-total">
              <span>Total</span>
              <span className="bf-total-price">{totalPrice()}</span>
            </div>

            {submitError && <p className="bf-error">{submitError}</p>}

            <button type="submit" className="bf-submit" disabled={!form.date || submitting}>
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      )}

      {step === "success" && (
        <div className="bf-success" onClick={(e) => e.stopPropagation()}>
          <div className="bf-success-icon">🎉</div>
          <h2 className="bf-success-title">Booking Confirmed!</h2>
          <p className="bf-success-msg">
            Your trip to <strong>{tour.name}</strong> on <strong>{formatDate(form.date)}</strong> is booked!
          </p>
          <p className="bf-success-sub">
            Check your Destinations page to view your booking details.
          </p>
          <button className="bf-submit" onClick={() => { onClose(); onGoToDestinations(); }}>Got it!</button>
        </div>
      )}
    </div>
  );
}