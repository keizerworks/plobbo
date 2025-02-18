import { useState } from "react";

import workersClient from "~/lib/axios";

interface UploadedFile {
    url: string;
    name: string;
}

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);

    const uploadFileFn = async (file: File) => {
        setIsUploading(true);
        setUploadingFile(file);

        try {
            const formData = new FormData();
            formData.set("file", file);

            const { url } = await workersClient
                .put<{ url: string }>("blogs/placeholder-images", formData)
                .then((r) => r.data);

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
