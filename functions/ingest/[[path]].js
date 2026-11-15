const PROXYABLE_PATH = /^\/(?:static|array|decide|flags|e|i|s|batch|surveys|capture)(?:\/|$)/;

export async function onRequest({ request }) {
    const url = new URL(request.url);
    url.pathname = url.pathname.replace(/^\/ingest/, '');

    if (!PROXYABLE_PATH.test(url.pathname)) return new Response('Not found', { status: 404 });

    url.hostname = url.pathname.startsWith('/static/') || url.pathname.startsWith('/array/')
        ? 'eu-assets.i.posthog.com'
        : 'eu.i.posthog.com';
    url.protocol = 'https:';
    url.port = '';

    const headers = new Headers(request.headers);
    headers.delete('cookie');
    headers.delete('authorization');
    headers.set('Host', url.hostname);
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');

    return fetch(url, {
        method: request.method,
        headers,
        body: request.body ? await request.arrayBuffer() : null,
        redirect: 'manual'
    });
}
