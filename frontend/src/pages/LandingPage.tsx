import { useState, useRef, useEffect } from "react";
import "./LandingPage.css";
import guim from "../assets/images/guim_2k.jpg";
import boracay from "../assets/images/bora.jpg";
import palawan from "../assets/images/palaw_2k.jpg";
import bacolod from "../assets/images/bcd_2k.png";
import islagigantes from "../assets/images/isla_2k.png";
import iloilo from "../assets/images/ilo_2k.png";

interface CardData {
  title: string;
  description: string;
  bg: string;
}

interface LandingPageProps {
  onExplore: () => void;
}

const allImages: CardData[] = [
  {
    title: "Guimaras",
    description:
      "A beautiful island province in the Philippines, Guimaras is famous for its world-class sweet mangoes, pristine beaches, clear waters, and relaxing tropical scenery.",
    bg: guim,
  },
  {
    title: "Boracay",
    description:
      "A world-famous tropical island in the Philippines, Boracay is known for its powdery white sand beaches, crystal-clear waters, vibrant nightlife, and stunning sunsets.",
    bg: boracay,
  },
  {
    title: "Palawan",
    description:
      "A paradise island province in the Philippines, Palawan is celebrated for its crystal-clear lagoons, limestone cliffs, rich biodiversity, and breathtaking natural wonders.",
    bg: palawan,
  },
  {
    title: "Bacolod",
    description:
      "A vibrant city in the Philippines, Bacolod City is famous for its MassKara Festival, delicious chicken inasal, historic landmarks, and nearby heritage sites like the Ruins—an iconic, romantic mansion often called the Taj Mahal of Negros.",
    bg: bacolod,
  },
  {
    title: "Iloilo",
    description:
      "A vibrant heritage city in the Philippines, Iloilo City is known for its rich history, Spanish-era churches, delicious local cuisine, and warm Ilonggo hospitality.",
    bg: iloilo,
  },
  {
    title: "Isla Gigantes",
    description:
      "A stunning island group in Islas de Gigantes, known for its dramatic limestone cliffs, crystal-clear waters, white sand beaches, hidden caves, and abundant fresh seafood, especially scallops.",
    bg: islagigantes,
  },
];

export default function LandingPage({ onExplore }: LandingPageProps) {
  const [cardIndexes, setCardIndexes] = useState<[number, number, number]>([0, 1, 2]);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CardData[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const activeCard = allImages[cardIndexes[activeSlot]];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allImages.filter((img) =>
        img.title.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSelectSuggestion = (card: CardData) => {
    const index = allImages.findIndex((img) => img.title === card.title);
    setCardIndexes((prev) => {
      const next = [...prev] as [number, number, number];
      if (!next.includes(index)) {
        next[0] = index;
      } else {
        const existingSlot = next.indexOf(index);
        [next[0], next[existingSlot]] = [next[existingSlot], next[0]];
      }
      return next;
    });
    setActiveSlot(0);
    setQuery(card.title);
    setSuggestions([]);
  };

  const handleCardClick = (slot: number) => {
    if (slot === activeSlot) {
      setCardIndexes((prev) => {
        const next = [...prev] as [number, number, number];
        const used = new Set(next);
        let nextIndex = (next[slot] + 1) % allImages.length;
        while (used.has(nextIndex) && nextIndex !== next[slot]) {
          nextIndex = (nextIndex + 1) % allImages.length;
        }
        next[slot] = nextIndex;
        return next;
      });
    } else {
      setActiveSlot(slot);
    }
  };

  return (
    <div
      className="hero"
      style={{ backgroundImage: `url(${activeCard.bg})` }}
    >
      <div className="overlay" />

      <div className="top-search" ref={searchRef}>
        <input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={handleSearchChange}
        />
        <button>Search</button>

        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((card) => (
              <li
                key={card.title}
                onClick={() => handleSelectSuggestion(card)}
              >
                <div
                  className="suggestion-thumb"
                  style={{ backgroundImage: `url(${card.bg})` }}
                />
                <div className="suggestion-info">
                  <span className="suggestion-title">{card.title}</span>
                  <span className="suggestion-desc">{card.description.slice(0, 60)}...</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="content">
        <div className="left-half">
          <h1 className="title">{activeCard.title}</h1>
          <p className="description">{activeCard.description}</p>
          <button className="explore-btn" onClick={onExplore}>Explore</button>
        </div>

        <div className="right-half">
          <div className="card-swap">
            {cardIndexes.map((imgIndex, slot) => {
              const card = allImages[imgIndex];
              return (
                <div
                  key={slot}
                  className={`swap-card ${slot === activeSlot ? "active" : ""}`}
                  style={{ backgroundImage: `url(${card.bg})` }}
                  onClick={() => handleCardClick(slot)}
                  title={slot === activeSlot ? `Click to swap image` : `Click to select ${card.title}`}
                >
                  <h3>{card.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}