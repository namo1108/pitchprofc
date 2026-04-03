// netlify/functions/football.js
// API-Football 서버사이드 프록시 — CORS 완전 해결

const API_BASE = 'https://v3.football.api-sports.io';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // API 키: 환경변수 우선, 없으면 클라이언트 헤더에서
  const apiKey = process.env.FOOTBALL_API_KEY || event.headers['x-api-key'];
  if (!apiKey) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'API key required' }),
    };
  }

  const params = { ...(event.queryStringParameters || {}) };
  const path = params.path || '/status';
  delete params.path;

  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}${path}${qs ? '?' + qs : ''}`;

  try {
    const res = await fetch(url, {
      headers: {
        'x-apisports-key': apiKey,
        'x-apisports-host': 'v3.football.api-sports.io',
      },
    });
    const data = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'Upstream failed', detail: err.message }),
    };
  }
};
