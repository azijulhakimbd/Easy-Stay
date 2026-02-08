import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
    );
    const data = await res.json();

    if (data.length > 0) {
      return NextResponse.json([
        {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        },
      ]);
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}
