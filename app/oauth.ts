import * as client from "openid-client";

interface TokenStore {
  accessToken?: string;
  configKey?: string;
  configPromise?: Promise<client.Configuration>;
  expiresAt?: number;
  refreshPromise?: Promise<string>;
  refreshToken?: string;
}

const globalForOAuth = globalThis as unknown as {
  __mirloOAuthStore?: TokenStore;
};

const store: TokenStore = globalForOAuth.__mirloOAuthStore ?? {};
globalForOAuth.__mirloOAuthStore = store;

export function isOAuthBootstrapAllowed() {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return !process.env.REFRESH_TOKEN && !process.env.API_TOKEN;
}

export function getOidcConfig(): Promise<client.Configuration> {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const clientId = process.env.CLIENT_ID || "";
  const configKey = `${apiHost}|${clientId}|${apiKey}`;

  if (!store.configPromise || store.configKey !== configKey) {
    const server = new URL(apiHost);
    store.configKey = configKey;
    store.configPromise = client
      .discovery(
        server,
        clientId,
        apiKey || undefined,
        apiKey ? client.ClientSecretBasic(apiKey) : client.None(),
        server.protocol === "http:"
          ? { execute: [client.allowInsecureRequests] }
          : undefined,
      )
      .catch((error) => {
        store.configPromise = undefined;
        throw error;
      });
  }
  return store.configPromise;
}

export function cacheTokens(tokens: client.TokenEndpointResponse) {
  store.accessToken = tokens.access_token;
  store.expiresAt = Date.now() + (tokens.expires_in ?? 3600) * 1000;
  if (tokens.refresh_token) {
    store.refreshToken = tokens.refresh_token;
  }
}

export function clearAccessToken() {
  store.accessToken = undefined;
  store.expiresAt = undefined;
}

export async function getAccessToken(): Promise<string> {
  if (
    store.accessToken &&
    store.expiresAt &&
    Date.now() < store.expiresAt - 60_000
  ) {
    return store.accessToken;
  }

  const clientId = process.env.CLIENT_ID || "";
  const refreshToken = store.refreshToken || process.env.REFRESH_TOKEN;
  if (refreshToken && clientId) {
    if (!store.refreshPromise) {
      store.refreshPromise = getOidcConfig()
        .then((config) => client.refreshTokenGrant(config, refreshToken))
        .then((tokens) => {
          cacheTokens(tokens);
          return tokens.access_token;
        })
        .finally(() => {
          store.refreshPromise = undefined;
        });
    }
    return store.refreshPromise;
  }

  return store.accessToken || process.env.API_TOKEN || "";
}
