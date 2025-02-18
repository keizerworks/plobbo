"use client";

import { useState } from "react";

import { getPreSignedUrlPutObject } from "~/actions/editor/s3/presigned-url/put";
import { uploadToPresignedUrl } from "~/lib/utils";

interface UploadedFile {
    url: string;
    name: string;
}

export function useS3Upload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);

    const uploadFileFn = async (file: File) => {
        setIsUploading(true);
        setUploadingFile(file);

        try {
            const { url, uploadUrl } = await getPreSignedUrlPutObject(
                file.name,
            );

            const res = await uploadToPresignedUrl(uploadUrl, file)
                .then((res) => res)
                .catch((err) => {
                    console.log(err);
                    throw new Error();
                });

            if (!res.ok) {
                throw new Error();
            }

            setUploadedFile({
                url,
                name: file.name,
            });
        } catch (error) {
            console.error("Upload failed:", error);
            if (error instanceof Error) console.log(error.message);
        } finally {
            setIsUploading(false);
            setUploadingFile(null);
        }
    };

    return {
        isUploading,
        uploadFile: uploadFileFn,
        uploadedFile,
        uploadingFile,
    };
}
