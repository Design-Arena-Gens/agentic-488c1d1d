import { NextResponse } from "next/server";

const API_URL = "https://api.aladhan.com/v1/timings";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");
  const method = url.searchParams.get("method") ?? "2";
  const school = url.searchParams.get("school") ?? "0";
  const latitudeAdjustment = url.searchParams.get("latitudeAdjustment") ?? "0";

  if (!latitude || !longitude) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  const params = new URLSearchParams({
    latitude,
    longitude,
    method,
    school,
    latitudeAdjustmentMethod: latitudeAdjustment
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 502 });
  }

  const data = await response.json();

  return NextResponse.json({
    timings: data.data.timings,
    date: data.data.date,
    meta: data.data.meta
  });
}
