import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gzipSync } from 'node:zlib';
import { onRequest } from '../functions/ingest/[[path]].js';

test('PostHog proxy routes assets and API requests without leaking site credentials', async (t) => {
    const body = gzipSync(JSON.stringify({ event: 'proxy-test' }));
    const response = new Response('upstream response', { status: 202 });
    const upstream = t.mock.method(globalThis, 'fetch', async () => response);

    for (const [path, host, method] of [
        ['/static/array.js', 'eu-assets.i.posthog.com', 'GET'],
        ['/static/web-vitals.js', 'eu-assets.i.posthog.com', 'HEAD'],
        ['/array/project/config.js', 'eu-assets.i.posthog.com', 'GET'],
        ['/flags/', 'eu.i.posthog.com', 'POST'],
        ['/i/v0/e/', 'eu.i.posthog.com', 'POST'],
        ['/s/', 'eu.i.posthog.com', 'POST'],
        ['/e/', 'eu.i.posthog.com', 'OPTIONS']
    ]) {
        const request = new Request(`http://localhost:8788/ingest${path}?v=2&test=a%2Fb`, {
            method,
            headers: {
                Host: 'localhost:8788',
                Cookie: 'session=private',
                Authorization: 'Bearer private',
                'CF-Connecting-IP': '203.0.113.1',
                'X-Forwarded-For': 'spoofed',
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            },
            body: method === 'POST' ? body : null
        });
        assert.equal(await onRequest({ request }), response);
        const [url, options] = upstream.mock.calls.at(-1).arguments;
        assert.equal(url.href, `https://${host}${path || '/'}?v=2&test=a%2Fb`);
        assert.equal(options.method, method);
        assert.equal(options.redirect, 'manual');
        assert.equal(options.headers.get('Host'), host);
        assert.equal(options.headers.get('X-Forwarded-For'), '203.0.113.1');
        assert.equal(options.headers.get('Content-Type'), 'application/json');
        assert.equal(options.headers.get('Content-Encoding'), 'gzip');
        assert.equal(options.headers.has('Cookie'), false);
        assert.equal(options.headers.has('Authorization'), false);
        assert.deepEqual(options.body && Buffer.from(options.body), method === 'POST' ? body : null);
    }
});

test('PostHog proxy refuses paths outside the SDK surface', async (t) => {
    const upstream = t.mock.method(globalThis, 'fetch', async () => new Response('upstream'));

    for (const path of ['', '/', '/api/projects', '/attacker.example/static/array.js', '/%2e%2e/api/projects', '/capturex']) {
        const response = await onRequest({ request: new Request(`https://caisah.info/ingest${path}`, { method: 'POST' }) });

        assert.equal(response.status, 404);
    }

    assert.equal(upstream.mock.callCount(), 0);
});
