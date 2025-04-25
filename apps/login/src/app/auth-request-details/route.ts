import { getAuthRequest } from "@/lib/zitadel";
import { getServiceUrlFromHeaders } from "@/lib/headers";
import { headers as requestHeaders } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const headers = await requestHeaders();
    const queryStringParams = req.nextUrl.searchParams;
    const authRequestID = queryStringParams.get("authRequestID") || '';
    
    const { serviceUrl } = getServiceUrlFromHeaders(headers);

    const { authRequest } = await getAuthRequest({
        serviceUrl,
        authRequestId: authRequestID?.replace('oidc_', ''),
    });
    
    try {
        const parsedLoginHint = JSON.parse(authRequest?.loginHint || "{}");
        return NextResponse.json({ application: parsedLoginHint.app || null });
    } catch (e) {
        return NextResponse.json({ application: null});
    }
}