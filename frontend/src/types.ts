// src/types.ts

export interface Tour {
  id: number;
  name: string;
  price: string;
  image?: string;       // optional to prevent TS errors
  description?: string;
  duration?: string;
}

export interface BookingData {
  id: string;
  tour: Tour;
  fullName: string;
  email: string;
  phone: string;
  persons: number;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
}

// Tour schedule types
export type TourDate = {
  date: string;
  spotsLeft: number;
};

export type TourSchedule = Record<string, TourDate[]>;