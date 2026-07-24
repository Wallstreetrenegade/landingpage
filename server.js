const http = require('http');
const fs = require('fs');
const path = require('path');
const pergaOptin = require('./api/perga-optin');

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.json': 'application/json; charset=utf-8' };

function apiResponse(res) {
  return {
    status(code) { res.statusCode = code; return this; },
    json(value) { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(value)); }
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/perga-optin') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', async () => {
      try { req.body = raw ? JSON.parse(raw) : {}; }
      catch { return apiResponse(res).status(400).json({ status: false, message: 'Invalid request.' }); }
      await pergaOptin(req, apiResponse(res));
    });
    return;
  }

  const requestPath = url.pathname === '/' ? '/optin.html' : url.pathname === '/thank-you' ? '/thank-you.html' : url.pathname;
  const file = path.resolve(root, `.${requestPath}`);
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, '127.0.0.1', () => console.log(`PERGA preview running at http://localhost:${port}`));
