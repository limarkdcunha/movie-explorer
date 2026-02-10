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

  // FIXED VALUE: Using your OMDb key directly or from env
  const apiKey = process.env.OMDB_API_KEY;
  const baseUrl = "http://www.omdbapi.com";

  // OMDb specific URL format (s=query, type=movie)
  const url = `${baseUrl}/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Handle OMDb's specific "False" response
    if (data.Response === "False") {
      return NextResponse.json({ results: [] });
    }

    // OMDb returns data.Search, but our frontend expects data.results
    return NextResponse.json({ results: data.Search });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
