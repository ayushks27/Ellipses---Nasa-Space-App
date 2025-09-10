export async function GET(req) {
  try {
    const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies/', {
      headers: {
        Authorization: `Bearer ${process.env.PLANETARY_API_KEY}`
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: response.statusText }), { status: response.status });
    }

    const data = await response.json();
    const planets = data.bodies.filter(body => body.isPlanet);

    return new Response(JSON.stringify(planets), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch planetary data' }), { status: 500 });
  }
}
