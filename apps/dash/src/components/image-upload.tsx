import { useCallback, useState } from "react";
import { Edit, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

interface ImageUploadProps {
  defaultSrc?: string;
  onChange: (file: File | undefined) => void;
  aspectVideo?: boolean;
  edit?: boolean;
  className?: string;
}

export function ImageUpload({
  defaultSrc,
  onChange,
  aspectVideo,
  edit,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(defaultSrc);

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
    setPreview(defaultSrc);
  };

  return (
    <div className="w-fit" {...getRootProps()}>
      <input {...getInputProps()} />
      {preview ? (
        <div
          className={cn(
            "relative aspect-square size-48",
            aspectVideo && "aspect-video w-full",
          )}
        >
          <img
            src={preview}
            alt="Preview"
            className="size-full rounded-lg object-cover"
          />

          <Button
            variant={edit ? "secondary" : "destructive"}
            size="icon"
            type="button"
            className="absolute -top-3 -right-3 scale-90"
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={edit ? () => {} : removeImage}
          >
            {edit ? <Edit className="size-4" /> : <X className="size-4" />}
          </Button>
        </div>
      ) : (
        <div
          className={`cursor-pointer rounded-lg border border-dashed p-4 text-center ${
            isDragActive ? "border-primary" : "border-muted-foreground"
          } ${className}`}
        >
          {isDragActive ? (
            <p className="text-sm">Drop the image here ...</p>
          ) : (
            <p className="text-sm">
              Drag &apos;n&apos; drop an image here, or click to select one
            </p>
          )}
        </div>
      )}
    </div>
  );
}
