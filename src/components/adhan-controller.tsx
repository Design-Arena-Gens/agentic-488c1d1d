"use client";

import { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { getNextPrayer } from "@/lib/prayer-times";
import type { PrayerTimes } from "@/types";
import { useTranslation } from "@/components/providers";

type AdhanControllerProps = {
  enabled: boolean;
  times?: PrayerTimes;
  timezone?: string;
};

const ADHAN_URL =
  "https://cdn.islamic.network/quran/audio/128/ar.alafasy/001.mp3";

export default function AdhanController({ enabled, times, timezone }: AdhanControllerProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [nextTrigger, setNextTrigger] = useState<DateTime | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(ADHAN_URL);
      audio.preload = "auto";
      audioRef.current = audio;
      audio.addEventListener("ended", () => setIsPreviewing(false));
    }

    if (!enabled || !times || !timezone) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setNextTrigger(null);
      setIsPreviewing(false);
      return;
    }

    const schedule = () => {
      const next = getNextPrayer(times, timezone);
      setNextTrigger(next.time);
      const ms = next.time.toMillis() - DateTime.local().setZone(timezone).toMillis();
      const safeMs = Math.max(ms, 0);
      timerRef.current = window.setTimeout(async () => {
        try {
          if (!audioRef.current) return;
          await audioRef.current.play();
          setIsPreviewing(true);
          setTimeout(() => setIsPreviewing(false), 1000 * 60 * 4);
        } catch (error) {
          console.error(error);
        }
        schedule();
      }, safeMs);
    };

    schedule();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [enabled, times, timezone]);

  const togglePreview = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(ADHAN_URL);
      audioRef.current.preload = "auto";
    }

    if (isPreviewing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPreviewing(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPreviewing(true);
    } catch (error) {
      console.error(error);
      alert(t("audio_not_supported"));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/25 via-slate-500/20 to-transparent" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">{t("enable_adhan")}</h2>
          <p className="mt-1 text-sm text-slate-200/80">
            {enabled ? t("disable_adhan") : t("enable_adhan")}
          </p>
          {nextTrigger && (
            <p className="mt-3 text-sm text-emerald-200">
              {t("next_prayer")}: {nextTrigger.toFormat("cccc · HH:mm")}
            </p>
          )}
        </div>
        <button
          onClick={togglePreview}
          className="inline-flex items-center justify-center rounded-full bg-emerald-400/80 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-400/25 transition hover:bg-emerald-300"
        >
          {isPreviewing ? t("stop_preview") : t("play_preview")}
        </button>
      </div>
    </div>
  );
}
