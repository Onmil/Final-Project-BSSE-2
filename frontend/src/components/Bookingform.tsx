import { useState } from "react";
import "./Bookingform.css";
import { formatDate } from "../data/tourDates";
import { Tour, BookingData, TourSchedule, TourDate } from "../types";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

interface BookingFormProps {
  tour: Tour;
  onClose: () => void;
  onConfirm: (booking: BookingData) => void;
  schedules: TourSchedule;
  userUuid: string | null;
  onGoToDestinations: () => void;
}

type Step = "form" | "payment" | "processing" | "payment_success" | "success";
type PaymentMethod = "gcash" | "maya" | "card" | "pay_on_arrival" | null;

const PAYMENT_OPTIONS = [
  { id: "gcash", label: "GCash", icon: "💙", description: "Pay via GCash e-wallet", badge: null },
  { id: "maya", label: "Maya", icon: "💚", description: "Pay via Maya e-wallet", badge: null },
  { id: "card", label: "Credit / Debit Card", icon: "💳", description: "Visa, Mastercard accepted", badge: null },
  { id: "pay_on_arrival", label: "Pay on Arrival", icon: "🤝", description: "Cash payment at meet-up point", badge: "No online fee" },
] as const;

const PAYMENT_LABELS: Record<string, { icon: string; label: string }> = {
  gcash:          { icon: "💙", label: "GCash" },
  maya:           { icon: "💚", label: "Maya" },
  card:           { icon: "💳", label: "Credit / Debit Card" },
  pay_on_arrival: { icon: "🤝", label: "Pay on Arrival" },
};

export default function BookingForm({ tour, onClose, onConfirm, schedules, userUuid, onGoToDestinations }: BookingFormProps) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", persons: 1, date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);

  const dates: TourDate[] = schedules[tour.name] ?? [];
  const selectedDate = dates.find((d) => d.date === form.date);
  const maxPersons = selectedDate ? selectedDate.spotsLeft : 40;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" && form.persons > (dates.find((d) => d.date === value)?.spotsLeft ?? 40) ? { persons: 1 } : {}),
    }));
  };

  const totalPrice = () => {
    const base = parseInt(tour.price.replace(/[^\d]/g, ""));
    return `₱${(base * form.persons).toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!selectedPayment) return;
    setSubmitting(true);
    setSubmitError("");
    const bookingStatus = selectedPayment === "pay_on_arrival" ? "pending" : "confirmed";

    try {
      const payload = {
        user_uuid: userUuid ?? null,
        tour_id: tour.id,
        booking_date: form.date,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        persons: Number(form.persons),
        payment_method: selectedPayment,
        status: bookingStatus,
      };

      const response = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || response.statusText || "Booking request failed");

      if (selectedPayment !== "pay_on_arrival") {
        setStep("processing");
        await new Promise((r) => setTimeout(r, 2200));
        setStep("payment_success");
        await new Promise((r) => setTimeout(r, 2500));
      }

      const booking: BookingData = {
        id: crypto.randomUUID(),
        tour,
        ...form,
        persons: Number(form.persons),
        status: bookingStatus,
      };
      onConfirm(booking);
      setStep("success");
    } catch (error: any) {
      setSubmitError(error?.message || "Payment failed. Please try again.");
      setStep("payment");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentInfo = selectedPayment ? PAYMENT_LABELS[selectedPayment] : null;

  return (
    <div className="bf-overlay" onClick={step === "success" ? onClose : undefined}>

      {step === "success" && (
        <div className="bf-confetti-wrap" aria-hidden>
          {Array.from({ length: 60 }).map((_, i) => (
            <span
              key={i}
              className="bf-confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: ["#5bb8a0", "#ffd700", "#ff6b6b", "#74b9ff", "#a29bfe", "#fd79a8"][i % 6],
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
            />
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
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Full Name" />
              </div>
              <div className="bf-field">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="peterparker@gmail.com" />
              </div>
            </div>

            <div className="bf-row">
              <div className="bf-field">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+63 912 345 6789" pattern="(\+63|0)9\d{9}" title="Enter a valid Philippine mobile number" />
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
                <button type="button" onClick={() => setForm((f) => ({ ...f, persons: Math.max(1, f.persons - 1) }))}>−</button>
                <span>{form.persons}</span>
                <button type="button" onClick={() => setForm((f) => ({ ...f, persons: Math.min(maxPersons, f.persons + 1) }))}>+</button>
              </div>
            </div>

            <div className="bf-total">
              <span>Total</span>
              <span className="bf-total-price">{totalPrice()}</span>
            </div>

            {submitError && <p className="bf-error">{submitError}</p>}
            <button type="submit" className="bf-submit" disabled={!form.date || submitting}>Proceed to Payment</button>
          </form>
        </div>
      )}

      {step === "payment" && (
        <div className="bf-box bf-payment-box" onClick={(e) => e.stopPropagation()}>
          <div className="bf-payment-header">
            <button className="bf-back-btn" onClick={() => setStep("form")} aria-label="Back">← Back</button>
            <h2 className="bf-payment-title">Choose Payment</h2>
            <button className="bf-close" onClick={onClose}>✕</button>
          </div>

          <div className="bf-order-summary">
            <div className="bf-order-row"><span className="bf-order-label">Tour</span><span className="bf-order-value">{tour.name}</span></div>
            <div className="bf-order-row"><span className="bf-order-label">Date</span><span className="bf-order-value">{formatDate(form.date)}</span></div>
            <div className="bf-order-row"><span className="bf-order-label">Persons</span><span className="bf-order-value">{form.persons}</span></div>
            <div className="bf-order-divider" />
            <div className="bf-order-row bf-order-total-row"><span className="bf-order-label">Total Amount</span><span className="bf-order-total-val">{totalPrice()}</span></div>
          </div>

          <p className="bf-payment-subtitle">Select a payment method</p>
          <div className="bf-payment-options">
            {PAYMENT_OPTIONS.map((opt) => (
              <button key={opt.id} className={`bf-payment-option${selectedPayment === opt.id ? " bf-payment-option--selected" : ""}`} onClick={() => setSelectedPayment(opt.id as PaymentMethod)} type="button">
                <span className="bf-pay-icon">{opt.icon}</span>
                <div className="bf-pay-info">
                  <span className="bf-pay-label">{opt.label}</span>
                  <span className="bf-pay-desc">{opt.description}</span>
                </div>
                {opt.badge && <span className="bf-pay-badge">{opt.badge}</span>}
                <span className="bf-pay-radio">{selectedPayment === opt.id ? "●" : "○"}</span>
              </button>
            ))}
          </div>

          {submitError && <p className="bf-error">{submitError}</p>}

          <button className="bf-submit" disabled={!selectedPayment || submitting} onClick={handlePayment} type="button">
            {submitting ? "Processing..." : selectedPayment === "pay_on_arrival" ? "Confirm Booking" : `Pay ${totalPrice()} →`}
          </button>

          <p className="bf-payment-note">🔒 Payments are secured via PayMongo</p>
        </div>
      )}

      {step === "processing" && (
        <div className="bf-box bf-processing-box" onClick={(e) => e.stopPropagation()}>
          <div className="bf-processing-spinner" />
          <h3 className="bf-processing-title">Processing Payment…</h3>
          <p className="bf-processing-sub">Please wait while we confirm your payment.</p>
        </div>
      )}

      {step === "payment_success" && (
        <div className="bf-box bf-paysuccess-box" onClick={(e) => e.stopPropagation()}>
          <div className="bf-paysuccess-checkwrap">
            <svg className="bf-paysuccess-check" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="bf-check-circle" cx="26" cy="26" r="24" stroke="#5bb8a0" strokeWidth="3" fill="none" />
              <path className="bf-check-tick" d="M14 26 L22 34 L38 18" stroke="#5bb8a0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <h3 className="bf-paysuccess-title">Payment Successful!</h3>
          <p className="bf-paysuccess-amount">{totalPrice()}</p>
          <div className="bf-paysuccess-method">
            <span>{paymentInfo?.icon}</span>
            <span>Paid via {paymentInfo?.label}</span>
          </div>
          <p className="bf-paysuccess-sub">
            Thank you for trusting <strong>Toura</strong>! Your booking is being confirmed…
          </p>
        </div>
      )}

      {step === "success" && (
        <div className="bf-success" onClick={(e) => e.stopPropagation()}>
          <div className="bf-success-icon">{selectedPayment === "pay_on_arrival" ? "⏳" : "🎉"}</div>
          <h2 className="bf-success-title">{selectedPayment === "pay_on_arrival" ? "Booking Received!" : "Booking Confirmed!"}</h2>
          <p className="bf-success-msg">
            Your trip to <strong>{tour.name}</strong> on <strong>{formatDate(form.date)}</strong> is booked!
          </p>
          <p className="bf-success-sub">
            {selectedPayment === "pay_on_arrival"
              ? "Your booking is pending. Please prepare your cash payment at the meet-up point."
              : "Payment received. Your booking is confirmed. Check your email for confirmation."}
          </p>
          <button className="bf-submit" onClick={() => { onClose(); onGoToDestinations(); }}>
            View My Bookings →
          </button>
        </div>
      )}
    </div>
  );
}