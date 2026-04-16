const FD  = 'https://api.football-data.org/v4';
const KL  = 'https://v3.football.api-sports.io';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const { type='fd', path='', ...rest } = event.queryStringParameters || {};
  const qs = new URLSearchParams(rest).toString();

  try {
    if (type === 'fd') {
      const key = process.env.FOOTBALL_API_KEY || 'b00e3059f51741b7add3fcaab7eaadf0';
      const url = `${FD}${path}${qs ? '?' + qs : ''}`;
      const r = await fetch(url, { headers: { 'X-Auth-Token': key } });
      const data = await r.json();
      return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
    }
    if (type === 'kl') {
      const key = process.env.APIFOOTBALL_KEY || '421bb1da924d4946cbd3bab1313cc926';
      const url = `${KL}${path}${qs ? '?' + qs : ''}`;
      const r = await fetch(url, { headers: { 'x-apisports-key': key } });
      const data = await r.json();
      return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
    }
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown type' }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
