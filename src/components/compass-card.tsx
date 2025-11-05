"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { calculateQiblaHeading } from "@/lib/qibla";
import type { LocationCoordinates } from "@/types";
import { useTranslation } from "@/components/providers";

type CompassCardProps = {
  location?: LocationCoordinates;
};

const isIOS =
  typeof window !== "undefined" &&
  /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
  !(window as any).MSStream;

export default function CompassCard({ location }: CompassCardProps) {
  const { t } = useTranslation();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const targetHeading = useMemo(() => {
    if (!location) return null;
    return calculateQiblaHeading(location.latitude, location.longitude);
  }, [location]);

  const listenerRef = useRef<(event: DeviceOrientationEvent) => void>();

  const handleOrientationEvent = useCallback(
    (event: DeviceOrientationEvent) => {
      const enrichedEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      const heading =
        typeof enrichedEvent.webkitCompassHeading === "number"
          ? enrichedEvent.webkitCompassHeading
          : null;
      if (heading !== null) {
        setDeviceHeading(heading);
        return;
      }

      if (event.alpha != null) {
        const rotation = 360 - event.alpha;
        setDeviceHeading(rotation);
      }
    },
    []
  );

  const enableCompass = useCallback(async () => {
    try {
      if (isIOS && typeof DeviceOrientationEvent !== "undefined" && (DeviceOrientationEvent as any).requestPermission) {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response !== "granted") {
          setError(t("permission_needed"));
          return;
        }
      }

      if (typeof window === "undefined") return;
      window.addEventListener("deviceorientation", handleOrientationEvent);
      listenerRef.current = handleOrientationEvent;
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(t("permission_needed"));
    }
  }, [handleOrientationEvent, t]);

  useEffect(() => {
    return () => {
      if (listenerRef.current && typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", listenerRef.current);
      }
    };
  }, []);

  if (!location || targetHeading == null) {
    return null;
  }

  const difference =
    deviceHeading != null ? ((targetHeading - deviceHeading + 360) % 360) : null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-400/15 via-slate-500/10 to-transparent" />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl text-white">{t("qibla_heading")}</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {location.city ?? ""} {difference != null && `· ${difference.toFixed(0)}°`}
        </span>
      </div>

      <div className="relative mx-auto grid h-72 w-72 place-content-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-emerald-300/40 bg-black/20 shadow-[0_0_80px_rgba(16,185,129,0.25)]"
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <div className="absolute inset-12 rounded-full border border-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Ka&apos;ba</p>
            <p className="mt-2 text-3xl font-semibold">{targetHeading.toFixed(0)}°</p>
            {difference != null && (
              <p className="mt-1 text-sm text-white/70">
                {difference > 180 ? `↺ ${Math.round(360 - difference)}°` : `↻ ${Math.round(difference)}°`}
              </p>
            )}
          </div>
        </div>
        <motion.div
          className="absolute top-1/2 left-1/2 h-28 w-1 origin-top -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-b from-emerald-400 via-emerald-200 to-white shadow-[0_0_25px_rgba(45,212,191,0.6)]"
          animate={{ rotate: difference ?? 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_30px_rgba(45,212,191,0.8)]" />
        </div>
      </div>

      {!permissionGranted && (
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/80">
          <p>{t("compass_needs_permission")}</p>
          <button
            className="mt-3 inline-flex items-center rounded-full bg-emerald-400/80 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
            onClick={enableCompass}
          >
            {t("enable_compass")}
          </button>
        </div>
      )}

      {permissionGranted && (
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-white/60">
          {t("calibrate_compass")}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-rose-300">
          {error}
        </p>
      )}
    </motion.div>
  );
}
