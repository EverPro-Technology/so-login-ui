import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {getServiceUrlFromHeaders} from "@/lib/headers";

export const config = {
  matcher: [
    "/.well-known/:path*",
    "/oauth/:path*",
    "/oidc/:path*",
    "/idps/callback/:path*",
    "/saml/:path*",
      "/login",
      "/accounts",
  ], 
};

export async function middleware(request: NextRequest, response : NextResponse) {
  const urlParams = request.nextUrl.searchParams;
  // escape proxy if the environment is setup for multitenancy
  if (!process.env.ZITADEL_API_URL || !process.env.ZITADEL_SERVICE_USER_TOKEN) {
    return NextResponse.next();
  }

  if (['/login', '/accounts'].includes(request.nextUrl.pathname) && (urlParams.has("authRequest") || urlParams.has('requestId'))) {
    const response = NextResponse.next();
    const authRequestID = urlParams.get("authRequest") || urlParams.get('requestId');
    
    const authDetailsResponse = await fetch(`${request.nextUrl.origin}/auth-request-details?authRequestID=${authRequestID}`);
    console.log(authRequestID);
    if (!authDetailsResponse.ok) {
      console.log('problem with hint defaulting to default application');
      return response;
    }
    const authDetails = await authDetailsResponse.json();
    
    response.cookies.set("application", authDetails?.application, {
      maxAge: 500 * 365 * 24 * 60 * 60,
      path: "/"
    });
    
    return response;
  }

  const _headers = await headers();

  const { serviceUrl } = getServiceUrlFromHeaders(_headers);

  const instanceHost = `${serviceUrl}`.replace("https://", "");

  const requestHeaders = new Headers(request.headers);

  // this is a workaround for the next.js server not forwarding the host header
  // requestHeaders.set("x-zitadel-forwarded", `host="${request.nextUrl.host}"`);
  requestHeaders.set("x-zitadel-public-host", `${request.nextUrl.host}`);

  // this is a workaround for the next.js server not forwarding the host header
  requestHeaders.set("x-zitadel-instance-host", instanceHost);

  const responseHeaders = new Headers();
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Headers", "*");

  request.nextUrl.href = `${serviceUrl}${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
    headers: responseHeaders,
  });
}
