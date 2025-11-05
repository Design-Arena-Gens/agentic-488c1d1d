"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import HeaderHero from "@/components/header-hero";
import PrayerTimesCard from "@/components/prayer-times-card";
import CompassCard from "@/components/compass-card";
import SettingsDrawer from "@/components/settings-drawer";
import AdhanController from "@/components/adhan-controller";
import { useTranslation } from "@/components/providers";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { LocationCoordinates, PrayerTimes } from "@/types";
import { CALCULATION_METHODS, HIGH_LATITUDE_RULES, JURISTIC_METHODS, POPULAR_CITIES } from "@/lib/constants";
import { normalizePrayerTimes } from "@/lib/prayer-times";

type PrayerTimesPayload = {
  timings: Record<string, string>;
  timezone: string;
  readable: string;
};

const FALLBACK_LOCATION = POPULAR_CITIES[0];

export default function HomePage() {
  const { t, locale, setLocale } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<DateTime | null>(null);
  const [location, setLocation] = useState<LocationCoordinates | undefined>(undefined);
  const [payload, setPayload] = useState<PrayerTimesPayload | null>(null);

  const [methodId, setMethodId] = useLocalStorage<number>("mirac_method", CALCULATION_METHODS[0].id);
  const [juristicId, setJuristicId] = useLocalStorage<number>("mirac_juristic", JURISTIC_METHODS[0].id);
  const [highLatitudeId, setHighLatitudeId] = useLocalStorage<number>(
    "mirac_high_latitude",
    HIGH_LATITUDE_RULES[0].id
  );
  const [adhanEnabled, setAdhanEnabled] = useLocalStorage<boolean>("mirac_adhan_enabled", false);

  const prayerTimes: PrayerTimes | undefined = useMemo(() => {
    if (!payload) return undefined;
    const normalized = normalizePrayerTimes(payload.timings, payload.timezone);
    return normalized.times;
  }, [payload]);

  const timezone = payload?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchPrayerTimes = useCallback(
    async (coords: LocationCoordinates) => {
      setFetching(true);
      setError(null);

      const params = new URLSearchParams({
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        method: methodId.toString(),
        school: juristicId.toString(),
        latitudeAdjustment: highLatitudeId.toString()
      });

      try {
        const response = await fetch(`/api/prayer-times?${params.toString()}`, {
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error("Network error");
        }
        const data = await response.json();
        setPayload({
          timings: data.timings,
          timezone: data.meta.timezone,
          readable: data.date.readable
        });
        setLastUpdated(DateTime.local());
      } catch (err) {
        console.error(err);
        setError(t("error_loading_times"));
      } finally {
        setFetching(false);
      }
    },
    [methodId, juristicId, highLatitudeId, t]
  );

  const acquireLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocation(FALLBACK_LOCATION);
      return;
    }

    setFetching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(coords);
        setFetching(false);
      },
      () => {
        setLocation(FALLBACK_LOCATION);
        setError(t("location_permission_denied"));
        setFetching(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [t]);

  useEffect(() => {
    acquireLocation();
  }, [acquireLocation]);

  useEffect(() => {
    if (!location) return;
    fetchPrayerTimes(location);
  }, [fetchPrayerTimes, location]);

  const handleManualLocation = (coords: LocationCoordinates) => {
    setLocation(coords);
    fetchPrayerTimes(coords);
  };

  return (
    <main className="relative mx-auto max-w-6xl gap-8 px-4 pb-16 pt-10 md:px-8">
      <div className="fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,#14b8a6,transparent_60%)] opacity-40" />
      <HeaderHero
        location={location}
        timezone={timezone}
        lastUpdated={lastUpdated ?? undefined}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {fetching && !prayerTimes && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
              {t("loading")}
            </div>
          )}
          {error && (
            <div className="rounded-3xl border border-rose-500/40 bg-rose-500/15 p-6 text-rose-100">
              <p>{error}</p>
              <button
                className="mt-4 rounded-full bg-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/30"
                onClick={() => location && fetchPrayerTimes(location)}
              >
                {t("retry")}
              </button>
            </div>
          )}
          {prayerTimes && timezone && <PrayerTimesCard times={prayerTimes} timezone={timezone} />}
          <div className="mt-8 space-y-6">
            <AdhanController enabled={adhanEnabled} times={prayerTimes} timezone={timezone} />
          </div>
        </div>
        <div className="lg:col-span-5">
          <CompassCard location={location} />
        </div>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        methods={CALCULATION_METHODS}
        juristic={JURISTIC_METHODS}
        highLatitude={HIGH_LATITUDE_RULES}
        selectedMethodId={methodId}
        selectedJuristicId={juristicId}
        selectedHighLatitudeId={highLatitudeId}
        onMethodChange={setMethodId}
        onJuristicChange={setJuristicId}
        onHighLatitudeChange={setHighLatitudeId}
        locale={locale}
        onLocaleChange={setLocale}
        adhanEnabled={adhanEnabled}
        onAdhanToggle={setAdhanEnabled}
        onSelectLocation={handleManualLocation}
      />
    </main>
  );
}
