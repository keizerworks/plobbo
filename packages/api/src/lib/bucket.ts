import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Resource } from "sst/resource";

export const s3Client = new S3Client({ region: "us-east-1" });

export const uploadFile = async (filename: string, file: File) =>
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Resource.bucket.name,
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: "public-read",
    }),
  );

export const deleteFile = async (key: string) =>
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: Resource.bucket.name, Key: key }),
  );
