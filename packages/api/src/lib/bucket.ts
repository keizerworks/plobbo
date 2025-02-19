import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Resource } from "sst/resource";

export const s3Client = new S3Client({ region: "us-east-1" });

export const uploadFile = async (filename: string, file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: Resource.bucket.name,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.length,
    }),
  );
};

export const deleteFile = async (key: string) =>
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: Resource.bucket.name, Key: key }),
  );
