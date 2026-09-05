export default async (request) => {
  try {
    const apiKey =
  process.env.VITE_API_FOOTBALL_KEY ||
  process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "API-Football key is not configured.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const url = new URL(request.url);

    const path = url.pathname.replace(
      /^\/\.netlify\/functions\/football\/?/,
      ""
    );

    const apiUrl = `https://v3.football.api-sports.io/${path}${url.search}`;

    const response = await fetch(apiUrl, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API-Football proxy error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to connect to API-Football.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};