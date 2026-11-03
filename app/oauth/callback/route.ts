import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import * as client from "openid-client";

import {
  cacheTokens,
  getOidcConfig,
  isOAuthBootstrapAllowed,
} from "../../oauth";

export async function GET(request: NextRequest) {
  if (!isOAuthBootstrapAllowed()) {
    return NextResponse.json(
      { error: "OAuth bootstrap is disabled when REFRESH_TOKEN is set." },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("oauth_pkce")?.value;
  cookieStore.delete("oauth_pkce");

  if (!rawCookie) {
    return NextResponse.json(
      { error: "Missing OAuth session cookie. Try /oauth/login again." },
      { status: 400 },
    );
  }

  try {
    const saved = JSON.parse(rawCookie) as {
      nonce: string;
      state: string;
      verifier: string;
    };
    const config = await getOidcConfig();
    const tokens = await client.authorizationCodeGrant(
      config,
      new URL(request.url),
      {
        expectedNonce: saved.nonce,
        expectedState: saved.state,
        pkceCodeVerifier: saved.verifier,
      },
    );

    cacheTokens(tokens);

    return new NextResponse(
      [
        "OAuth token exchange succeeded! Add this to your .env file:",
        "",
        `REFRESH_TOKEN=${tokens.refresh_token || ""}`,
        "",
        "(Tokens have also been cached in memory for the current server process.)",
      ].join("\n"),
      {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Token exchange failed",
      },
      { status: 400 },
    );
  }
}
