"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import axios from "axios";

export function useImageKitUpload() {
    const [progress, setProgress] = useState(0);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortController = useRef(new AbortController());

    const authenticator = async () => {
        const { data } = await axios.get("/api/upload-auth");
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        setIsUploading(true);
        setProgress(0);
        setError(null);

        try {
            const authParams = await authenticator();
            const { signature, expire, token, publicKey } = authParams;

            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.current.signal,
            });

            const url = uploadResponse?.url ?? null;
            setUploadedUrl(url);
            return url;
        } catch (err) {
            if (err instanceof ImageKitAbortError) {
                setError("Upload aborted");
            } else if (err instanceof ImageKitInvalidRequestError) {
                setError("Invalid request");
            } else if (err instanceof ImageKitUploadNetworkError) {
                setError("Network error");
            } else if (err instanceof ImageKitServerError) {
                setError("Server error");
            } else {
                setError("Upload failed");
            }
            console.error("Upload error:", err);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const cancelUpload = () => {
        abortController.current.abort();
        abortController.current = new AbortController();
    };

    return { uploadFile, cancelUpload, progress, uploadedUrl, isUploading, error };
}