"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export function useClock(zone?: string) {
  const [now, setNow] = useState<DateTime>(() => DateTime.local().setZone(zone));

  useEffect(() => {
    setNow(DateTime.local().setZone(zone));
  }, [zone]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(DateTime.local().setZone(zone));
    }, 1000);
    return () => window.clearInterval(id);
  }, [zone]);

  return now;
}
