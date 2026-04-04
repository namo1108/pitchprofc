// netlify/functions/football.js
// football-data.org 프록시 + The Odds API 프록시

const FD_BASE = 'https://api.football-data.org/v4';
const ODDS_BASE = 'https://api.the-odds-api.com/v4';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const params = { ...(event.queryStringParameters || {}) };
  const type = params.type || 'fd'; // 'fd' or 'odds'
  const path = params.path || '';
  delete params.type;
  delete params.path;

  // football-data.org
  if (type === 'fd') {
    const apiKey = process.env.FOOTBALL_API_KEY;
    if (!apiKey) return { statusCode: 401, headers, body: JSON.stringify({ error: 'No FD key' }) };
    const qs = new URLSearchParams(params).toString();
    const url = `${FD_BASE}${path}${qs ? '?' + qs : ''}`;
    try {
      const res = await fetch(url, { headers: { 'X-Auth-Token': apiKey } });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (e) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  // The Odds API
  if (type === 'odds') {
    const oddsKey = process.env.ODDS_API_KEY;
    if (!oddsKey) return { statusCode: 401, headers, body: JSON.stringify({ error: 'No Odds key' }) };
    const qs = new URLSearchParams({ ...params, apiKey: oddsKey }).toString();
    const url = `${ODDS_BASE}${path}?${qs}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (e) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid type' }) };
};
