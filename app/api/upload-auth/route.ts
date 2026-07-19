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

    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.NEXT_IMAGEKIT_PRIVATE_KEY as string, 
        publicKey: process.env.NEXT_IMAGEKIT_PUBLIC_KEY as string,
        expire:15*60,
        token:crypto.randomUUID(),
    })

    return Response.json({ token, expire, signature, publicKey: process.env.NEXT_IMAGEKIT_PUBLIC_KEY })
}