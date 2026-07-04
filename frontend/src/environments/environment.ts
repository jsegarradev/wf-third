/**
 * Runtime environment configuration. `apiBaseUrl` is a relative prefix so the dev proxy (`proxy.conf.json`) forwards
 * `/api/*` to the backend on :8080 and the browser only makes same-origin calls (no CORS). In production the SPA is
 * served from the same origin as the API, so the relative prefix keeps working.
 */
export const environment = {
    production: false,
    apiBaseUrl: '/api',
};
