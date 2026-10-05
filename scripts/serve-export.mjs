import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('out');
const prefix = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'github-pages' ? '/portfolio-v2' : '';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) throw new Error('Wrong base path');
    let file = resolve(root, `.${pathname.slice(prefix.length) || '/'}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(4173, '127.0.0.1', () => console.log(`Static export at http://127.0.0.1:4173${prefix}/`));
