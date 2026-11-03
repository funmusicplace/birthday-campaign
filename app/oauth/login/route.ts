import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";

import { getOidcConfig, isOAuthBootstrapAllowed } from "../../oauth";

export async function GET(request: NextRequest) {
  if (!isOAuthBootstrapAllowed()) {
    return NextResponse.json(
      { error: "OAuth bootstrap is disabled when REFRESH_TOKEN is set." },
      { status: 403 },
    );
  }

  const clientId = process.env.CLIENT_ID || "";
  const redirectUri = `${request.nextUrl.origin}/oauth/callback`;

  if (!clientId) {
    return NextResponse.json(
      {
        error: "Missing CLIENT_ID environment variable.",
        instructions: [
          "1. Set CLIENT_ID in your .env file to your Mirlo client's numeric ID.",
          `2. In Mirlo Admin -> Clients, add ${redirectUri} to the client's Redirect URIs.`,
          "3. Visit /oauth/login again.",
        ],
      },
      { status: 400 },
    );
  }

  const config = await getOidcConfig();
  const verifier = client.randomPKCECodeVerifier();
  const challenge = await client.calculatePKCECodeChallenge(verifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  const cookieStore = await cookies();
  cookieStore.set("oauth_pkce", JSON.stringify({ nonce, state, verifier }), {
    httpOnly: true,
    maxAge: 600,
    path: "/oauth",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const authUrl = client.buildAuthorizationUrl(config, {
    code_challenge: challenge,
    code_challenge_method: "S256",
    nonce,
    prompt: "consent",
    redirect_uri: redirectUri,
    scope: "openid api offline_access",
    state,
  });

  return NextResponse.redirect(authUrl);
}
