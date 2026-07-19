import { getUploadAuthParams } from "@imagekit/next/server"
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const privateKey = process.env.NEXT_IMAGEKIT_PRIVATE_KEY as string;
    const publicKey = process.env.NEXT_IMAGEKIT_PUBLIC_KEY as string;

    console.log("[upload-auth] privateKey loaded:", privateKey ? `${privateKey.substring(0, 10)}...` : "MISSING");
    console.log("[upload-auth] publicKey loaded:", publicKey ? `${publicKey.substring(0, 10)}...` : "MISSING");

    const { token, expire, signature } = getUploadAuthParams({
        privateKey,
        publicKey,
    })

    console.log("[upload-auth] token:", token);
    console.log("[upload-auth] expire:", expire);
    console.log("[upload-auth] signature:", signature);

    return Response.json({ token, expire, signature, publicKey })
}