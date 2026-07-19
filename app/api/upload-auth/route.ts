import { getUploadAuthParams } from "@imagekit/next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiResponse } from "@/lib/api-response";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        
        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
        }

        const privateKey = process.env.NEXT_IMAGEKIT_PRIVATE_KEY as string;
        const publicKey = process.env.NEXT_IMAGEKIT_PUBLIC_KEY as string;

        if (!privateKey || !publicKey) {
            return ApiResponse.error("ImageKit credentials not configured", 500);
        }

        const { token, expire, signature } = getUploadAuthParams({
            privateKey,
            publicKey,
        });

        return ApiResponse.success({ token, expire, signature, publicKey }, "Upload auth params generated", 200);
    } catch (error: any) {
        console.error("Error generating upload auth params:", error);
        return ApiResponse.error(error.message || "Failed to generate upload auth params", 500);
    }
}