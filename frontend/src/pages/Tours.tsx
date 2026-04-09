import { useState } from "react";
import "./Tours.css";
import guim from "../assets/images/guim_2k.jpg";
import boracay from "../assets/images/bora.jpg";
import palawan from "../assets/images/palaw_2k.jpg";
import bacolod from "../assets/images/bcd_2k.png";
import islagigantes from "../assets/images/isla_2k.png";
import iloilo from "../assets/images/ilo_2k.png";
import { ITINERARIES } from "../data/Itineraries";

interface Tour {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  inclusions: string[];
}

interface Package {
  id: number;
  name: string;
  destinations: string[];
  days: number;
  price: string;
  inclusions: string[];
  images: string[];
}

interface ToursPageProps {
  onBook: (item: Tour | Package) => void;
}

interface ItineraryModalProps {
  tourId: number;
  tourName: string;
  tourImage: string;
  onClose: () => void;
}

function ItineraryModal({ tourId, tourName, tourImage, onClose }: ItineraryModalProps) {
  const itinerary = ITINERARIES[tourId];
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
          <button className="itin-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
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

const tours: Tour[] = [
  {
    id: 1, name: "Guimaras",
    description: "Explore pristine beaches and taste the world-famous sweet mangoes of this peaceful island province.",
    price: "₱2,500", image: guim,
    inclusions: ["Round-trip boat transfer", "Island tour guide", "Mango farm visit", "Packed lunch"],
  },
  {
    id: 2, name: "Boracay",
    description: "Relax on powdery white sand beaches and enjoy the vibrant nightlife of this iconic tropical island.",
    price: "₱7,500", image: boracay,
    inclusions: ["Hotel accommodation", "Daily breakfast", "Beach activities", "Airport transfers"],
  },
  {
    id: 3, name: "Palawan",
    description: "Discover crystal-clear lagoons, limestone cliffs, and the stunning Puerto Princesa Underground River.",
    price: "₱10,000", image: palawan,
    inclusions: ["Hotel accommodation", "Daily breakfast", "Underground River tour", "Island hopping"],
  },
  {
    id: 4, name: "Iloilo",
    description: "Discover the City of Love with its stunning heritage churches, vibrant festivals, and world-class cuisine.",
    price: "₱2,500", image: iloilo,
    inclusions: ["Heritage church tour", "Food trip guide", "City tour", "Local transport"],
  },
  {
    id: 5, name: "Bacolod",
    description: "The City of Smiles — famous for the MassKara Festival, sweet piaya, and warm Negrense hospitality.",
    price: "₱3,000", image: bacolod,
    inclusions: ["The Ruins visit", "Chicken inasal food tour", "City tour guide", "Local transport"],
  },
  {
    id: 6, name: "Isla Gigantes",
    description: "A hidden gem in Iloilo featuring pristine beaches, giant scallops, and breathtaking island scenery.",
    price: "₱3,500", image: islagigantes,
    inclusions: ["Boat tour", "Scallop feast", "Island hopping", "Snorkeling gear"],
  },
];

const packages: Package[] = [
  {
    id: 101,
    name: "BGPS Explorer",
    destinations: ["Boracay", "Guimaras", "Palawan", "Isla Gigantes"],
    days: 10,
    price: "₱18,500",
    inclusions: ["Hotel accommodation", "Daily breakfast", "Island hopping tours", "Airport transfers"],
    images: [boracay, guim, palawan, islagigantes],
  },
  {
    id: 102,
    name: "Island Duo",
    destinations: ["Boracay", "Palawan"],
    days: 6,
    price: "₱9,500",
    inclusions: ["Hotel accommodation", "Daily breakfast", "Guided tours", "Airport transfers"],
    images: [boracay, palawan],
  },
  {
    id: 103,
    name: "Islands & Scallops",
    destinations: ["Isla Gigantes", "Guimaras"],
    days: 5,
    price: "₱7,000",
    inclusions: ["Hotel accommodation", "Daily breakfast", "Island hopping", "Scallop farm visit"],
    images: [islagigantes, guim],
  },
  {
    id: 104,
    name: "Iloilo & Guimaras",
    destinations: ["Iloilo", "Guimaras"],
    days: 4,
    price: "₱5,500",
    inclusions: ["Hotel accommodation", "Daily breakfast", "Mango farm tour", "Heritage city tour"],
    images: [iloilo, guim],
  },
  {
    id: 105,
    name: "Iloilo & Bacolod",
    destinations: ["Iloilo", "Bacolod"],
    days: 5,
    price: "₱6,000",
    inclusions: ["Hotel accommodation", "Daily breakfast", "MassKara cultural tour", "Heritage walking tour"],
    images: [iloilo, bacolod],
  },
  {
    id: 106,
    name: "Visayas Grand Tour",
    destinations: ["Iloilo", "Boracay", "Palawan"],
    days: 9,
    price: "₱14,500",
    inclusions: ["Hotel accommodation", "Daily breakfast", "Island hopping", "City tours", "Airport transfers"],
    images: [iloilo, boracay, palawan],
  },
];

export default function ToursPage({ onBook }: ToursPageProps) {
  const [itineraryModal, setItineraryModal] = useState<{
    id: number;
    name: string;
    image: string;
  } | null>(null);

  const openItinerary = (id: number, name: string, image: string) => {
    setItineraryModal({ id, name, image });
  };

  const closeItinerary = () => setItineraryModal(null);

  return (
    <div className="tours-page">
      {/* Single Destinations */}
      <div className="tours-header">
        <p className="tours-eyebrow">EXPLORE THE PHILIPPINES</p>
        <h1 className="tours-title">Our Tours</h1>
        <p className="tours-subtitle">Choose from our handpicked destinations and start your adventure.</p>
      </div>

      <div className="tours-grid">
        {tours.map((tour) => {
          const hasItinerary = !!ITINERARIES[tour.id];
          return (
            <div key={tour.id} className="tour-card">
              <div className="tour-image-wrapper">
                <img src={tour.image} alt={tour.name} className="tour-image" />
              </div>
              <div className="tour-info">
                <div className="tour-top">
                  <h3 className="tour-name">{tour.name}</h3>
                  <span className="package-days">1 Day</span>
                </div>
                <p className="tour-desc">{tour.description}</p>

                <ul className="tour-inclusions">
                  {tour.inclusions.map((item) => (
                    <li key={item}><span className="check">✓</span> {item}</li>
                  ))}
                </ul>

                <div className="tour-footer">
                  <div>
                    <p className="package-label">Total Price</p>
                    <span className="tour-price">{tour.price} / person</span>
                  </div>
                  <div className="tour-actions">
                    {hasItinerary && (
                      <button
                        className="tour-itinerary-btn"
                        onClick={() => openItinerary(tour.id, tour.name, tour.image)}
                      >
                        🗓 Itinerary
                      </button>
                    )}
                    <button className="tour-btn" onClick={() => onBook(tour)}>Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Tours */}
      <div className="packages-header">
        <p className="tours-eyebrow">BUNDLED DEALS</p>
        <h2 className="tours-title">Package Tours</h2>
        <p className="tours-subtitle">Get more for less — explore multiple destinations in one trip.</p>
      </div>

      <div className="packages-grid">
        {packages.map((pkg) => {
          const hasItinerary = !!ITINERARIES[pkg.id];
          return (
            <div key={pkg.id} className="package-card">
              <div className="package-images">
                {pkg.images.map((img, i) => (
                  <img key={i} src={img} alt={pkg.destinations[i]} className="package-img" />
                ))}
              </div>

              <div className="package-info">
                <div className="package-top">
                  <h3 className="package-name">{pkg.name}</h3>
                  <span className="package-days">{pkg.days} Days</span>
                </div>

                <div className="package-destinations">
                  {pkg.destinations.map((d) => (
                    <span key={d} className="dest-pill">{d}</span>
                  ))}
                </div>

                <ul className="package-inclusions">
                  {pkg.inclusions.map((item) => (
                    <li key={item}><span className="check">✓</span> {item}</li>
                  ))}
                </ul>

                <div className="package-footer">
                  <div>
                    <p className="package-label">Total Price</p>
                    <p className="package-price">{pkg.price} / person</p>
                  </div>
                  <div className="tour-actions">
                    {hasItinerary && (
                      <button
                        className="tour-itinerary-btn"
                        onClick={() => openItinerary(pkg.id, pkg.name, pkg.images[0])}
                      >
                        🗓 Itinerary
                      </button>
                    )}
                    <button
                      className="tour-btn"
                      onClick={() => onBook(pkg)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {itineraryModal && (
        <ItineraryModal
          tourId={itineraryModal.id}
          tourName={itineraryModal.name}
          tourImage={itineraryModal.image}
          onClose={closeItinerary}
        />
      )}
    </div>
  );
}