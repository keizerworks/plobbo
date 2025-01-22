import { useState } from "react";
import { uploadFile } from "actions/editor/upload-file";

interface UploadedFile {
  url: string;
  name: string;
}

export function useS3Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  const uploadFileFn = async (file: File) => {
    setIsUploading(true);
    setUploadingFile(file);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const res = await uploadFile(formData);
      if (!res.success) {
        throw new Error();
      }

      setUploadedFile({
        url: res.url,
        name: file.name,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setUploadingFile(null);
    }
  };

  return {
    isUploading,
    progress,
    uploadFile: uploadFileFn,
    uploadedFile,
    uploadingFile,
  };
}
