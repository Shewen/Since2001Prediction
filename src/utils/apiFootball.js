
const API_URL = "/api/football";
const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;

async function apiRequest(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "x-apisports-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }

  return data.response;
}

export async function getLeagues(search = "") {
  const endpoint = search
    ? `/leagues?search=${encodeURIComponent(search)}`
    : "/leagues";

  return apiRequest(endpoint);
}

export async function getTeams(leagueId, season) {
  return apiRequest(
    `/teams?league=${leagueId}&season=${season}`
  );
}

export async function getFixtures(leagueId, season, date) {
  let endpoint = `/fixtures?league=${leagueId}&season=${season}`;

  if (date) {
    endpoint += `&date=${date}`;
  }

  return apiRequest(endpoint);
}

export async function getFixturePrediction(fixtureId) {
  return apiRequest(
    `/predictions?fixture=${fixtureId}`
  );
}

export function formatPrediction(fixture, predictionData) {
  const prediction = predictionData?.[0]?.predictions;

  if (!prediction) {
    return null;
  }

  return {
    id: fixture.fixture.id,

    league: fixture.league.name,

    date: fixture.fixture.date,

    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,

    homeLogo: fixture.teams.home.logo,
    awayLogo: fixture.teams.away.logo,

    prediction:
      prediction.advice ||
      prediction.winner?.name ||
      "No prediction",

    confidence:
      parseInt(prediction.percent?.home) ||
      0,

    markets: {
      winner: prediction.winner,
      winOrDraw: prediction.win_or_draw,
      underOver: prediction.under_over,
      goals: prediction.goals,
    },
  };
}

export async function getDailyPredictions(
  leagueId,
  season,
  date
) {
  const fixtures = await getFixtures(
    leagueId,
    season,
    date
  );

  const predictions = [];

  for (const fixture of fixtures) {
    try {
      const predictionData = await getFixturePrediction(
        fixture.fixture.id
      );

      const formatted = formatPrediction(
        fixture,
        predictionData
      );

      if (formatted) {
        predictions.push(formatted);
      }
    } catch (error) {
      console.error(
        `Failed to get prediction for fixture ${fixture.fixture.id}`,
        error
      );
    }
  }

  return predictions;
}

export async function findFixture(
  leagueId,
  season,
  date,
  homeTeamName,
  awayTeamName
) {
  const fixtures = await getFixtures(
    leagueId,
    season,
    date
  );

  const normalize = (name) =>
    name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  const home = normalize(homeTeamName);
  const away = normalize(awayTeamName);

  const fixture = fixtures.find((item) => {
    const apiHome = normalize(item.teams?.home?.name);
    const apiAway = normalize(item.teams?.away?.name);

    return apiHome === home && apiAway === away;
  });

  return fixture || null;
}

