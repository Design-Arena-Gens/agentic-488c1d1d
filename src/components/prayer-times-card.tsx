"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { DateTime } from "luxon";
import { useTranslation } from "@/components/providers";
import type { PrayerName, PrayerTimes } from "@/types";
import { formatCountdown, getNextPrayer } from "@/lib/prayer-times";
import { useClock } from "@/hooks/useClock";

type PrayerTimesCardProps = {
  times: PrayerTimes;
  timezone: string;
};

const PRAYER_LABEL_KEY: Record<PrayerName, string> = {
  Fajr: "prayer_fajr",
  Sunrise: "prayer_sunrise",
  Dhuhr: "prayer_dhuhr",
  Asr: "prayer_asr",
  Maghrib: "prayer_maghrib",
  Isha: "prayer_isha"
};

export default function PrayerTimesCard({ times, timezone }: PrayerTimesCardProps) {
  const { t } = useTranslation();
  const now = useClock(timezone);
  const nextPrayer = getNextPrayer(times, timezone, now);

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/20 via-slate-500/10 to-transparent" />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-white">{t("prayer_times")}</h2>
          <p className="mt-1 text-sm text-slate-200/80">
            {t("next_prayer")}: {t(PRAYER_LABEL_KEY[nextPrayer.name])} ·{" "}
            {nextPrayer.time.toFormat("HH:mm")} · {formatCountdown(nextPrayer.interval)} {t("upcoming_in")}
          </p>
        </div>
        <motion.div
          className="hidden h-20 w-20 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-emerald-50 md:flex"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        >
          <span className="text-sm uppercase tracking-[0.4em]">{t("countdown_label")}</span>
        </motion.div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {(Object.keys(times) as PrayerName[]).map((prayer) => {
          const isNext = prayer === nextPrayer.name;
          const prayerTime = DateTime.fromFormat(times[prayer], "HH:mm", {
            zone: timezone
          });
          return (
            <motion.div
              key={prayer}
              className={clsx(
                "flex items-center justify-between rounded-2xl border px-4 py-3 transition",
                isNext
                  ? "border-emerald-400/60 bg-emerald-400/15 text-white shadow-lg shadow-emerald-400/20"
                  : "border-white/10 bg-white/5 text-slate-100"
              )}
              animate={{ scale: isNext ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: isNext ? Infinity : 0, duration: 3, ease: "easeInOut" }}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                  {t(PRAYER_LABEL_KEY[prayer])}
                </p>
                <p className="text-xl font-semibold">{times[prayer]}</p>
              </div>
              <div className="text-right text-sm text-white/60">
                <p>{prayerTime.toFormat("ccc")}</p>
                <p>{prayerTime.toRelative({ base: now })}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
