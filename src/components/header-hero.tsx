"use client";

import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { useTranslation } from "@/components/providers";
import { useClock } from "@/hooks/useClock";
import type { LocationCoordinates } from "@/types";

type HeaderHeroProps = {
  location?: LocationCoordinates;
  timezone?: string;
  lastUpdated?: DateTime;
  onOpenSettings: () => void;
};

export default function HeaderHero({ location, timezone, lastUpdated, onOpenSettings }: HeaderHeroProps) {
  const { t } = useTranslation();
  const now = useClock(timezone);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/25 via-sky-500/10 to-transparent"
        animate={{ opacity: [0.8, 1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-white drop-shadow-sm tracking-tight">
            {t("app_title")}
          </h1>
          <p className="mt-2 text-lg text-slate-200">{t("app_subtitle")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-200/80">
            <span className="rounded-full bg-white/10 px-4 py-1">
              {location?.city ?? t("fallback_city")}
              {location?.country ? ` · ${location.country}` : ""}
            </span>
            {timezone && (
              <span className="rounded-full bg-white/10 px-4 py-1">
                {t("timezone")}: {timezone.replace("_", " ")}
              </span>
            )}
            {lastUpdated && (
              <span className="rounded-full bg-white/10 px-4 py-1">
                {t("last_updated")}: {lastUpdated.setLocale("tr").toFormat("dd MMMM HH:mm")}
              </span>
            )}
          </div>
        </div>
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-right text-slate-50 md:text-left md:min-w-[220px]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Hijri</p>
          <p className="mt-1 text-2xl font-semibold">
            {now.setLocale("ar").toFormat("dd LLLL yyyy")}
          </p>
          <p className="mt-2 text-sm text-white/70">{now.toFormat("cccc, dd MMMM yyyy · HH:mm:ss")}</p>
        </motion.div>
      </div>
      <button
        onClick={onOpenSettings}
        className="absolute top-5 right-5 rounded-full bg-white/15 px-4 py-2 text-sm text-white shadow-lg transition hover:bg-white/25"
      >
        {t("open_settings")}
      </button>
    </div>
  );
}
