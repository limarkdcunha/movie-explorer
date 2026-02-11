import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }
  const apiKey = process.env.OMDB_API_KEY;
  const baseUrl = process.env.OMDB_BASE_URL;

  const url = `${baseUrl}/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({ results: data.Search });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" + error },
      { status: 500 },
    );
  }
}
