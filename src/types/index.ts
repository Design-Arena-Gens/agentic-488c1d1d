export type PrayerName =
  | "Fajr"
  | "Sunrise"
  | "Dhuhr"
  | "Asr"
  | "Maghrib"
  | "Isha";

export type PrayerTimes = Record<PrayerName, string>;

export type CalculationMethod = {
  id: number;
  name: string;
};

export type HighLatitudeRule = {
  id: number;
  name: string;
};

export type JuristicMethod = {
  id: number;
  name: string;
};

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
};

export type PrayerTimingsResponse = {
  data: {
    timings: Record<string, string>;
    date: {
      timestamp: string;
      readable: string;
      hijri: {
        date: string;
        weekday: { ar: string };
      };
      gregorian: {
        weekday: { en: string };
      };
    };
    meta: {
      timezone: string;
      method: { name: string };
      latitude: number;
      longitude: number;
    };
  };
  code: number;
  status: string;
};
