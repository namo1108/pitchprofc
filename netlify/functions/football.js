const FD_BASE = 'https://api.football-data.org/v4';
const KL_BASE = 'https://v3.football.api-sports.io';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const params = { ...(event.queryStringParameters || {}) };
  const type = params.type || 'fd';
  const path = params.path || '';
  delete params.type;
  delete params.path;

  try {
    // ── football-data.org ──
    if (type === 'fd') {
      const apiKey = process.env.FOOTBALL_API_KEY;
      if (!apiKey) {
        return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'No API key', message: 'FOOTBALL_API_KEY 환경변수를 Netlify에 설정해주세요' }) };
      }
      const qs = new URLSearchParams(params).toString();
      const url = `${FD_BASE}${path}${qs ? '?' + qs : ''}`;

      const res = await fetch(url, {
        headers: { 'X-Auth-Token': apiKey, 'Accept': 'application/json' }
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Parse error', status: res.status }) }; }

      // Rate limit 응답 그대로 전달 (클라이언트에서 처리)
      return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
    }

    // ── api-football.com (K리그) ──
    if (type === 'kl') {
      const apiKey = process.env.APIFOOTBALL_KEY || '421bb1da924d4946cbd3bab1313cc926';
      const qs = new URLSearchParams(params).toString();
      const url = `${KL_BASE}${path}${qs ? '?' + qs : ''}`;

      const res = await fetch(url, {
        headers: { 'x-apisports-key': apiKey, 'Accept': 'application/json' }
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Parse error', status: res.status }) }; }

      return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'Unknown type' }) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
