import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.OMDB_API_KEY;
  const baseUrl = "http://www.omdbapi.com";

  const url = `${baseUrl}/?i=${encodeURIComponent(id)}&plot=full&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      return NextResponse.json({ error: data.Error }, { status: 404 });
    }

    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 },
    );
  }
}
