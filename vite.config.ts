import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { isB2WExecutiveStrategyPasswordValid } from './server/b2wExecutiveStrategyAccess';

function b2wExecutiveStrategyDevAccess(): Plugin {
  return {
    name: 'b2w-executive-strategy-dev-access',
    configureServer(server) {
      server.middlewares.use('/api/b2w-executive-strategy', (req, res) => {
        res.setHeader('Cache-Control', 'no-store, private');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Allow', 'POST');
          res.end(JSON.stringify({ ok: false, error: `Method ${req.method} not allowed.` }));
          return;
        }

        const chunks: Buffer[] = [];
        let totalBytes = 0;

        req.on('data', (chunk) => {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          totalBytes += buffer.length;
          if (totalBytes <= 8_192) chunks.push(buffer);
        });

        req.on('end', () => {
          if (totalBytes > 8_192) {
            res.statusCode = 413;
            res.end(JSON.stringify({ ok: false, authenticated: false, error: 'Request is too large.' }));
            return;
          }

          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as {
              password?: string;
            };

            if (!isB2WExecutiveStrategyPasswordValid(String(body.password ?? ''))) {
              res.statusCode = 401;
              res.end(JSON.stringify({
                ok: false,
                authenticated: false,
                error: 'That password is not correct.',
              }));
              return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, authenticated: true }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({
              ok: false,
              authenticated: false,
              error: 'The request could not be read.',
            }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [b2wExecutiveStrategyDevAccess(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify; file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
