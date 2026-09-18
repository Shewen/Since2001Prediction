export default async (request) => {
  try {
    const url = new URL(request.url);

    // Choose API provider
    const provider = url.searchParams.get("provider") || "api-football";

    // Remove provider from the query string before forwarding
    url.searchParams.delete("provider");

    // =========================================================
    // FOOTBALL-DATA.ORG
    // =========================================================
    if (provider === "football-data") {
      const apiToken = process.env.FOOTBALL_DATA_API_TOKEN;

      if (!apiToken) {
        return new Response(
          JSON.stringify({
            error: "Football-Data.org API token is not configured.",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const path = url.pathname.replace(
        /^\/\.netlify\/functions\/football\/?/,
        ""
      );

      const apiUrl = `https://api.football-data.org/v4/${path}${url.search}`;

      const response = await fetch(apiUrl, {
        headers: {
          "X-Auth-Token": apiToken,
        },
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // =========================================================
    // API-FOOTBALL
    // =========================================================
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
    console.error("Football API proxy error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to connect to football API.",
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