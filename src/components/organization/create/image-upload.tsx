"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "components/ui/button";
import { X } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onChange: (file: File | undefined) => void;
}

export function ImageUpload({ onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".svg"] },
    maxFiles: 1,
  });

  const removeImage = () => {
    onChange(undefined);
    setPreview(undefined);
  };

  return preview ? (
    <div className="relative aspect-square size-48">
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <Image src={preview} alt="Preview" fill className="object-cover" />
      </div>

      <Button
        variant="destructive"
        size="icon"
        className="absolute -right-3 -top-3 scale-90"
        onClick={removeImage}
      >
        <X className="size-4" />
      </Button>
    </div>
  ) : (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border border-dashed p-4 text-center ${
        isDragActive ? "border-primary" : "border-muted-foreground"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-sm">Drop the image here ...</p>
      ) : (
        <p className="text-sm">
          Drag 'n' drop an image here, or click to select one
        </p>
      )}
    </div>
  );
}
