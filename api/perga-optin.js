const OVERVIEW_URL = 'https://pergainc.com/joshuaboyd/pages/overview';
const LEAD_URL = 'https://pergainc.com/save-overview-lead';

function setCookies(response, jar) {
  const values = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : (response.headers.get('set-cookie') || '').split(/,(?=\s*[^;,=\s]+=[^;]+)/);
  for (const value of values) {
    const pair = value.split(';', 1)[0];
    const equals = pair.indexOf('=');
    if (equals > 0) jar.set(pair.slice(0, equals).trim(), pair.slice(equals + 1).trim());
  }
}

function cookieHeader(jar) {
  return [...jar].map(([key, value]) => `${key}=${value}`).join('; ');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Method not allowed.' });

  const fullName = String(req.body?.full_name || '').trim();
  const email = String(req.body?.email || '').trim();
  const phone = String(req.body?.phone || '').trim();
  const instagram = String(req.body?.instagram || '').trim();
  if (!fullName || !email || !phone) return res.status(422).json({ status: false, message: 'Please complete your name, email and phone number.' });

  try {
    const jar = new Map();
    let page = await fetch(OVERVIEW_URL, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 PERGA-Webinar' } });
    setCookies(page, jar);
    if (page.status >= 300 && page.status < 400 && page.headers.get('location')) {
      const redirected = new URL(page.headers.get('location'), OVERVIEW_URL).href;
      page = await fetch(redirected, { headers: { Cookie: cookieHeader(jar), 'User-Agent': 'Mozilla/5.0 PERGA-Webinar' } });
      setCookies(page, jar);
    }
    const html = await page.text();
    const token = html.match(/name="csrf-token"\s+content="([^"]+)"/)?.[1] || html.match(/name="_token"\s+value="([^"]+)"/)?.[1];
    if (!token) throw new Error('Unable to establish a secure PERGA session.');

    const form = new URLSearchParams({ _token: token, full_name: fullName, email, phone, instagram, pillar_customer_id: '2394', referred_by: 'joshuaboyd' });
    const upstream = await fetch(LEAD_URL, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': token, Origin: 'https://pergainc.com', Referer: page.url || OVERVIEW_URL, Cookie: cookieHeader(jar), 'User-Agent': 'Mozilla/5.0 PERGA-Webinar' },
      body: form.toString()
    });
    const text = await upstream.text();
    let data = {};
    try { data = JSON.parse(text); } catch {}
    if (!upstream.ok || !data.status) {
      const firstError = data.errors && Object.values(data.errors).flat()[0];
      return res.status(upstream.status >= 400 ? upstream.status : 502).json({ status: false, message: firstError || data.message || 'PERGA could not save the registration.' });
    }
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(502).json({ status: false, message: error.message || 'Unable to connect to PERGA.' });
  }
};
