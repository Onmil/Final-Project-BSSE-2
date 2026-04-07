export interface ItineraryDay {
  day: string;
  title: string;
  activities: { time: string; activity: string }[];
}

export interface TourItinerary {
  meetupTime: string;
  meetupPlace: string;
  days: ItineraryDay[];
}

export const ITINERARIES: Record<number, TourItinerary> = {
  // Guimaras
  1: {
    meetupTime: "5:30 AM",
    meetupPlace: "Ortiz Wharf, Iloilo City",
    days: [
      {
        day: "Day 1",
        title: "Island Arrival & Mango Country",
        activities: [
          { time: "6:00 AM", activity: "Ferry departure from Ortiz Wharf to Jordan Wharf, Guimaras" },
          { time: "7:00 AM", activity: "Breakfast at a local Guimaras eatery" },
          { time: "8:30 AM", activity: "Visit Guimaras Mango Farm — taste the world-famous sweet mangoes" },
          { time: "10:30 AM", activity: "Explore Trappist Monastery & taste mango products" },
          { time: "12:00 PM", activity: "Lunch with fresh seafood at the beachside" },
          { time: "2:00 PM", activity: "Swim & relax at Raymen Beach or Natago Beach" },
          { time: "4:30 PM", activity: "Sunset viewing at the Guimaras coastline" },
          { time: "5:30 PM", activity: "Ferry back to Iloilo City" },
        ],
      },
    ],
  },

  // Boracay
  2: {
    meetupTime: "4:00 AM",
    meetupPlace: "Iloilo Airport Departure Area",
    days: [
      {
        day: "Day 1",
        title: "Arrival & White Beach",
        activities: [
          { time: "6:00 AM", activity: "Flight to Caticlan / Kalibo Airport" },
          { time: "8:00 AM", activity: "Boat transfer to Boracay Island" },
          { time: "9:00 AM", activity: "Hotel check-in & freshen up" },
          { time: "11:00 AM", activity: "Stroll along White Beach Station 1–3" },
          { time: "1:00 PM", activity: "Lunch at a beachfront restaurant" },
          { time: "3:00 PM", activity: "Beach activities — swimming, sandcastle, parasailing" },
          { time: "6:00 PM", activity: "Sunset sailing on a paraw boat" },
          { time: "8:00 PM", activity: "Dinner & evening at D'Mall" },
        ],
      },
      {
        day: "Day 2",
        title: "Island Hopping & Nightlife",
        activities: [
          { time: "7:00 AM", activity: "Breakfast at the hotel" },
          { time: "9:00 AM", activity: "Island hopping — Crystal Cove, Crocodile Island, snorkeling" },
          { time: "12:30 PM", activity: "Packed lunch on the boat" },
          { time: "3:00 PM", activity: "Free time — ATV ride, helmet diving, or spa" },
          { time: "6:00 PM", activity: "Fire dancing show at the beach" },
          { time: "8:00 PM", activity: "Night out along the beachfront bars" },
        ],
      },
      {
        day: "Day 3",
        title: "Leisure & Departure",
        activities: [
          { time: "7:00 AM", activity: "Breakfast & hotel checkout" },
          { time: "9:00 AM", activity: "Last swim or souvenir shopping" },
          { time: "11:00 AM", activity: "Boat transfer back to Caticlan Port" },
          { time: "1:00 PM", activity: "Flight back to Iloilo" },
        ],
      },
    ],
  },

  // Palawan
  3: {
    meetupTime: "3:30 AM",
    meetupPlace: "Iloilo Airport Departure Area",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Puerto Princesa",
        activities: [
          { time: "5:00 AM", activity: "Flight to Puerto Princesa Airport" },
          { time: "8:00 AM", activity: "Hotel check-in & breakfast" },
          { time: "10:00 AM", activity: "City tour — Palawan Wildlife Rescue Center, Baker's Hill" },
          { time: "12:30 PM", activity: "Lunch at a local Palawan restaurant" },
          { time: "2:30 PM", activity: "Honda Bay island hopping — Starfish Island, Luli Island" },
          { time: "6:00 PM", activity: "Dinner & rest at the hotel" },
        ],
      },
      {
        day: "Day 2",
        title: "Underground River Adventure",
        activities: [
          { time: "6:00 AM", activity: "Early breakfast & depart for Sabang Wharf" },
          { time: "8:30 AM", activity: "Boat ride to the Puerto Princesa Underground River" },
          { time: "9:30 AM", activity: "Guided cave tour inside the UNESCO World Heritage underground river" },
          { time: "12:00 PM", activity: "Lunch at Sabang beach area" },
          { time: "2:00 PM", activity: "Mangrove paddle boat tour" },
          { time: "5:00 PM", activity: "Return to Puerto Princesa city" },
          { time: "7:00 PM", activity: "Seafood dinner at the waterfront" },
        ],
      },
      {
        day: "Day 3",
        title: "Leisure & Departure",
        activities: [
          { time: "7:00 AM", activity: "Breakfast & hotel checkout" },
          { time: "9:00 AM", activity: "Souvenir shopping at Palawan Pasalubong Center" },
          { time: "11:00 AM", activity: "Transfer to Puerto Princesa Airport" },
          { time: "1:00 PM", activity: "Flight back to Iloilo" },
        ],
      },
    ],
  },

  // Iloilo
  4: {
    meetupTime: "7:00 AM",
    meetupPlace: "Iloilo City Esplanade (Muelle Loney)",
    days: [
      {
        day: "Day 1",
        title: "Heritage, Food & Culture",
        activities: [
          { time: "7:30 AM", activity: "Breakfast at a classic Iloilo cafe — try La Paz Batchoy" },
          { time: "9:00 AM", activity: "Visit Miag-ao Church (UNESCO World Heritage Site)" },
          { time: "10:30 AM", activity: "Explore Jaro Cathedral & Jaro Plaza" },
          { time: "12:00 PM", activity: "Lunch at Tatoy's Manokan & Seafood — famous for lechon" },
          { time: "2:00 PM", activity: "Heritage walking tour — Calle Real, old Spanish-era buildings" },
          { time: "4:00 PM", activity: "Visit the Iloilo Museum of Contemporary Art (ILOMOCA)" },
          { time: "6:00 PM", activity: "Dinner at the Iloilo Esplanade food stalls" },
        ],
      },
    ],
  },

  // Bacolod
  5: {
    meetupTime: "5:00 AM",
    meetupPlace: "Parola Wharf, Iloilo City",
    days: [
      {
        day: "Day 1",
        title: "The City of Smiles",
        activities: [
          { time: "6:00 AM", activity: "Ferry from Iloilo to Bacolod (approx. 1 hour)" },
          { time: "7:30 AM", activity: "Breakfast — try fresh piaya and napoleones" },
          { time: "9:00 AM", activity: "Visit The Ruins — the iconic Taj Mahal of Negros" },
          { time: "11:00 AM", activity: "Explore Bacolod City Plaza & MassKara Festival murals" },
          { time: "12:30 PM", activity: "Lunch — Chicken Inasal at Manokan Country" },
          { time: "2:30 PM", activity: "Sweet treats tour — Calea Pastries, 21 Flavors" },
          { time: "4:30 PM", activity: "Visit San Sebastian Cathedral" },
          { time: "6:00 PM", activity: "Dinner & ferry back to Iloilo" },
        ],
      },
    ],
  },

  // Isla Gigantes
  6: {
    meetupTime: "4:00 AM",
    meetupPlace: "Estancia Port, Iloilo (van pickup from Iloilo City at 2:00 AM)" ,
    days: [
      {
        day: "Day 1",
        title: "Giant Scallops & Hidden Beaches",
        activities: [
          { time: "6:00 AM", activity: "Boat departure from Estancia Port to Isla Gigantes" },
          { time: "7:30 AM", activity: "Breakfast on arrival — fresh scallops & seafood" },
          { time: "9:00 AM", activity: "Island hopping — Cabugao Gamay Island (iconic viewpoint)" },
          { time: "10:30 AM", activity: "Snorkeling at the coral gardens" },
          { time: "12:00 PM", activity: "Lunch on the boat — grilled scallops & fresh catch" },
          { time: "1:30 PM", activity: "Visit Tangke Saltwater Lagoon — kayaking & swimming" },
          { time: "3:30 PM", activity: "Explore Antonia Beach — powdery white sand" },
          { time: "5:00 PM", activity: "Boat back to Estancia Port" },
          { time: "7:00 PM", activity: "Van return to Iloilo City" },
        ],
      },
    ],
  },

  // BGPS Explorer (Package 101)
  101: {
    meetupTime: "4:00 AM",
    meetupPlace: "Iloilo Airport Departure Area",
    days: [
      { day: "Day 1–2", title: "Boracay — White Beach & Island Hopping", activities: [
        { time: "Day 1 Morning", activity: "Fly to Boracay, beach arrival & hotel check-in" },
        { time: "Day 1 Afternoon", activity: "White Beach stroll, paraw sailing at sunset" },
        { time: "Day 2", activity: "Island hopping — Crystal Cove & Crocodile Island, snorkeling" },
      ]},
      { day: "Day 3", title: "Guimaras — Mangoes & Monasteries", activities: [
        { time: "Morning", activity: "Fly back to Iloilo, ferry to Guimaras" },
        { time: "Afternoon", activity: "Mango farm visit, Trappist Monastery, Raymen Beach" },
      ]},
      { day: "Day 4–7", title: "Palawan — Underground River & Lagoons", activities: [
        { time: "Day 4", activity: "Fly to Puerto Princesa, Honda Bay island hopping" },
        { time: "Day 5", activity: "Puerto Princesa Underground River guided tour" },
        { time: "Day 6–7", activity: "El Nido island hopping — Big & Small Lagoon, Nacpan Beach" },
      ]},
      { day: "Day 8–10", title: "Isla Gigantes — Hidden Gem Finale", activities: [
        { time: "Day 8", activity: "Fly back to Iloilo, van to Estancia Port" },
        { time: "Day 9", activity: "Full-day island hopping — Cabugao Gamay, Tangke Lagoon, scallop feast" },
        { time: "Day 10", activity: "Return to Iloilo City, tour ends" },
      ]},
    ],
  },

  // Island Duo (Package 102)
  102: {
    meetupTime: "4:00 AM",
    meetupPlace: "Iloilo Airport Departure Area",
    days: [
      { day: "Day 1–3", title: "Boracay", activities: [
        { time: "Day 1", activity: "Arrive Boracay, White Beach & sunset paraw sailing" },
        { time: "Day 2", activity: "Island hopping, fire dancing show, nightlife" },
        { time: "Day 3 AM", activity: "Leisure morning, depart for Palawan" },
      ]},
      { day: "Day 4–6", title: "Palawan", activities: [
        { time: "Day 4", activity: "Arrive Puerto Princesa, Honda Bay island hopping" },
        { time: "Day 5", activity: "Underground River UNESCO tour & mangrove paddle" },
        { time: "Day 6", activity: "Souvenir shopping, fly back to Iloilo" },
      ]},
    ],
  },

  // Islands & Scallops (Package 103)
  103: {
    meetupTime: "2:00 AM",
    meetupPlace: "Iloilo City Hall (van pickup to Estancia)",
    days: [
      { day: "Day 1–2", title: "Isla Gigantes", activities: [
        { time: "Day 1", activity: "Boat to Isla Gigantes, island hopping, Cabugao Gamay & Tangke Lagoon" },
        { time: "Day 2", activity: "Scallop farm visit, Antonia Beach, return to Estancia" },
      ]},
      { day: "Day 3–5", title: "Guimaras", activities: [
        { time: "Day 3", activity: "Ferry to Guimaras, mango farm & Trappist Monastery" },
        { time: "Day 4", activity: "Beach hopping — Raymen Beach & Natago Beach" },
        { time: "Day 5", activity: "Sunrise at the coast, ferry back to Iloilo" },
      ]},
    ],
  },

  // Iloilo & Guimaras (Package 104)
  104: {
    meetupTime: "7:00 AM",
    meetupPlace: "Iloilo City Esplanade",
    days: [
      { day: "Day 1–2", title: "Iloilo City Heritage Tour", activities: [
        { time: "Day 1", activity: "Miag-ao Church, Jaro Cathedral, ILOMOCA, food trip at Tatoy's" },
        { time: "Day 2", activity: "Calle Real heritage walk, Iloilo Esplanade dinner" },
      ]},
      { day: "Day 3–4", title: "Guimaras Island Escape", activities: [
        { time: "Day 3", activity: "Ferry to Guimaras, mango farm, Trappist Monastery" },
        { time: "Day 4", activity: "Beach day at Raymen Beach, ferry back to Iloilo" },
      ]},
    ],
  },

  // Iloilo & Bacolod (Package 105)
  105: {
    meetupTime: "7:00 AM",
    meetupPlace: "Iloilo City Esplanade",
    days: [
      { day: "Day 1–2", title: "Iloilo City", activities: [
        { time: "Day 1", activity: "Heritage churches tour, La Paz Batchoy breakfast, ILOMOCA" },
        { time: "Day 2", activity: "Calle Real walk, seafood dinner at the Esplanade" },
      ]},
      { day: "Day 3–5", title: "Bacolod City", activities: [
        { time: "Day 3", activity: "Ferry to Bacolod, The Ruins visit, Manokan Country lunch" },
        { time: "Day 4", activity: "MassKara cultural tour, Calea pastries, San Sebastian Cathedral" },
        { time: "Day 5", activity: "Souvenir shopping, ferry back to Iloilo" },
      ]},
    ],
  },

  // Visayas Grand Tour (Package 106)
  106: {
    meetupTime: "4:00 AM",
    meetupPlace: "Iloilo Airport Departure Area",
    days: [
      { day: "Day 1–2", title: "Iloilo City", activities: [
        { time: "Day 1", activity: "Heritage churches, food trip, ILOMOCA" },
        { time: "Day 2", activity: "Calle Real walk, Esplanade dinner" },
      ]},
      { day: "Day 3–5", title: "Boracay", activities: [
        { time: "Day 3", activity: "Fly to Boracay, White Beach, sunset paraw sailing" },
        { time: "Day 4", activity: "Island hopping, snorkeling, fire dancing" },
        { time: "Day 5 AM", activity: "Leisure & depart for Palawan" },
      ]},
      { day: "Day 6–9", title: "Palawan", activities: [
        { time: "Day 6", activity: "Arrive Puerto Princesa, Honda Bay island hopping" },
        { time: "Day 7", activity: "Underground River UNESCO tour" },
        { time: "Day 8–9", activity: "El Nido lagoons, Nacpan Beach, fly back to Iloilo" },
      ]},
    ],
  },
};