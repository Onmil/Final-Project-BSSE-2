export interface TourDate {
  date: string;
  spotsLeft: number;
}

export interface TourSchedule {
  [tourTitle: string]: TourDate[];
}

export const tourSchedules: TourSchedule = {
  Guimaras: [
    { date: "2026-08-10", spotsLeft: 40 },
    { date: "2026-08-17", spotsLeft: 40 },
    { date: "2026-08-24", spotsLeft: 40 },
    { date: "2026-09-07", spotsLeft: 40 },
    { date: "2026-09-14", spotsLeft: 40 },
  ],
  Boracay: [
    { date: "2026-08-09", spotsLeft: 40 },
    { date: "2026-08-16", spotsLeft: 40 },
    { date: "2026-08-23", spotsLeft: 40 },
    { date: "2026-09-06", spotsLeft: 40 },
    { date: "2026-09-13", spotsLeft: 40 },
  ],
  Palawan: [
    { date: "2026-08-11", spotsLeft: 40 },
    { date: "2026-08-18", spotsLeft: 40 },
    { date: "2026-08-25", spotsLeft: 40 },
    { date: "2026-09-08", spotsLeft: 40 },
    { date: "2026-09-15", spotsLeft: 40 },
  ],
  Iloilo: [
    { date: "2026-08-08", spotsLeft: 40 },
    { date: "2026-08-15", spotsLeft: 40 },
    { date: "2026-08-22", spotsLeft: 40 },
    { date: "2026-09-05", spotsLeft: 40 },
    { date: "2026-09-12", spotsLeft: 40 },
  ],
  Bacolod: [
    { date: "2026-08-12", spotsLeft: 40 },
    { date: "2026-08-19", spotsLeft: 40 },
    { date: "2026-08-26", spotsLeft: 40 },
    { date: "2026-09-09", spotsLeft: 40 },
    { date: "2026-09-16", spotsLeft: 40 },
  ],
  "Isla Gigantes": [
    { date: "2026-08-13", spotsLeft: 40 },
    { date: "2026-08-20", spotsLeft: 40 },
    { date: "2026-08-27", spotsLeft: 40 },
    { date: "2026-09-10", spotsLeft: 40 },
    { date: "2026-09-17", spotsLeft: 40 },
  ],
  "BGPS Explorer": [
    { date: "2026-08-15", spotsLeft: 40 },
    { date: "2026-09-05", spotsLeft: 40 },
    { date: "2026-09-19", spotsLeft: 40 },
  ],
  "Island Duo": [
    { date: "2026-08-14", spotsLeft: 40 },
    { date: "2026-08-28", spotsLeft: 40 },
    { date: "2026-09-11", spotsLeft: 40 },
  ],
  "Islands & Scallops": [
    { date: "2026-08-16", spotsLeft: 40 },
    { date: "2026-08-30", spotsLeft: 40 },
    { date: "2026-09-13", spotsLeft: 40 },
  ],
  "Iloilo & Guimaras": [
    { date: "2026-08-09", spotsLeft: 40 },
    { date: "2026-08-23", spotsLeft: 40 },
    { date: "2026-09-06", spotsLeft: 40 },
  ],
  "Iloilo & Bacolod": [
    { date: "2026-08-10", spotsLeft: 40 },
    { date: "2026-08-24", spotsLeft: 40 },
    { date: "2026-09-07", spotsLeft: 40 },
  ],
  "Visayas Grand Tour": [
    { date: "2026-08-17", spotsLeft: 40 },
    { date: "2026-09-07", spotsLeft: 40 },
    { date: "2026-09-21", spotsLeft: 40 },
  ],
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}