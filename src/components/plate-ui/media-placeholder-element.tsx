/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type { TPlaceholderElement } from "@udecode/plate-media";
import type { ReactNode } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@udecode/cn";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  PlaceholderPlugin,
  PlaceholderProvider,
  updateUploadHistory,
  VideoPlugin,
} from "@udecode/plate-media/react";
import { useEditorPlugin, withHOC, withRef } from "@udecode/plate/react";
import { useS3Upload } from "hooks/use-s3-upload";
import { AudioLines, FileUp, Film, ImageIcon } from "lucide-react";
import { useFilePicker } from "use-file-picker";

import { PlateElement } from "./plate-element";
import { Spinner } from "./spinner";

const CONTENT: Record<
  string,
  {
    accept: string[];
    content: ReactNode;
    icon: ReactNode;
  }
> = {
  [AudioPlugin.key]: {
    accept: ["audio/*"],
    content: "Add an audio file",
    icon: <AudioLines />,
  },
  [FilePlugin.key]: {
    accept: ["*"],
    content: "Add a file",
    icon: <FileUp />,
  },
  [ImagePlugin.key]: {
    accept: ["image/*"],
    content: "Add an image",
    icon: <ImageIcon />,
  },
  [VideoPlugin.key]: {
    accept: ["video/*"],
    content: "Add a video",
    icon: <Film />,
  },
};

export const MediaPlaceholderElement = withHOC(
  PlaceholderProvider,
  withRef<typeof PlateElement>(
    ({ children, className, nodeProps: _, ...props }, ref) => {
      const editor = props.editor;
      const element = props.element as TPlaceholderElement;

      const { api } = useEditorPlugin(PlaceholderPlugin);

      const { isUploading, uploadFile, uploadedFile, uploadingFile } =
        useS3Upload();

      const loading = isUploading && uploadingFile;
      const currentContent = CONTENT[element.mediaType];
      const isImage = element.mediaType === ImagePlugin.key;
      const imageRef = useRef<HTMLImageElement>(null);

      const { openFilePicker } = useFilePicker({
        accept: currentContent?.accept,
        multiple: true,
        onFilesSelected: ({ plainFiles: updatedFiles }) => {
          const firstFile = updatedFiles[0];
          const restFiles = updatedFiles.slice(1);

          replaceCurrentPlaceholder(firstFile as File).catch(console.log);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (restFiles.length > 0) (editor as any).tf.insert.media(restFiles);
        },
      });

      const replaceCurrentPlaceholder = useCallback(
        async (file: File) => {
          await uploadFile(file);
          api.placeholder.addUploadingFile(element.id as string, file);
        },
        [api.placeholder, element.id, uploadFile],
      );

      useEffect(() => {
        if (!uploadedFile) return;

        const path = editor.api.findPath(element);

        editor.tf.withoutSaving(() => {
          editor.tf.removeNodes({ at: path });

          const node = {
            children: [{ text: "" }],
            initialHeight: imageRef.current?.height,
            initialWidth: imageRef.current?.width,
            isUpload: true,
            name: element.mediaType === FilePlugin.key ? uploadedFile.name : "",
            placeholderId: element.id as string,
            type: element.mediaType,
            url: uploadedFile.url,
          };

          editor.tf.insertNodes(node, { at: path });

          if (editor.operations) updateUploadHistory(editor, node);
        });

        api.placeholder.removeUploadingFile(element.id as string);
      }, [uploadedFile, element.id, editor, element, api.placeholder]);

      // React dev mode will call useEffect twice
      const isReplaced = useRef(false);

      /** Paste and drop */
      useEffect(() => {
        if (isReplaced.current) return;

        isReplaced.current = true;
        const currentFiles = api.placeholder.getUploadingFile(
          element.id as string,
        );

        if (!currentFiles) return;

        replaceCurrentPlaceholder(currentFiles).catch(console.log);
      }, [api.placeholder, element.id, isReplaced, replaceCurrentPlaceholder]);

      return (
        <PlateElement ref={ref} className={cn(className, "my-1")} {...props}>
          {(!loading || !isImage) && (
            <div
              className={cn(
                "flex cursor-pointer select-none items-center rounded-sm bg-muted p-3 pr-9 hover:bg-primary/10",
              )}
              onClick={() => !loading && openFilePicker()}
              contentEditable={false}
            >
              <div className="relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6">
                {currentContent?.icon}
              </div>
              <div className="whitespace-nowrap text-sm text-muted-foreground">
                <div>
                  {loading ? uploadingFile.name : currentContent?.content}
                </div>

                {loading && !isImage && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div>{formatBytes(uploadingFile.size ?? 0)}</div>
                    <div>–</div>
                    <Spinner className="mr-1 size-3.5" />
                  </div>
                )}
              </div>
            </div>
          )}

          {isImage && loading && (
            <ImageProgress file={uploadingFile} imageRef={imageRef} />
          )}

          {children}
        </PlateElement>
      );
    },
  ),
);

export function ImageProgress({
  className,
  file,
  imageRef,
}: {
  file: File;
  className?: string;
  imageRef?: React.RefObject<HTMLImageElement>;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return null;
  }

  return (
    <div className={cn("relative", className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-sm object-cover"
        alt={file.name}
        src={objectUrl}
      />
      <div className="absolute bottom-1 right-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
        <Spinner />
      </div>
    </div>
  );
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];

  if (bytes === 0) return "0 Byte";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}
