import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "../env";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: env.MINIO_URL,
  credentials: {
    accessKeyId: env.MINIO_ROOT_USER,
    secretAccessKey: env.MINIO_ROOT_PASSWORD,
  },
  forcePathStyle: true,
});

interface PutObjectSignedUrlProps {
  bucket: string;
  filename: string;
}

interface GetObjectSignedUrlProps extends PutObjectSignedUrlProps {
  expiresIn?: number;
}

export const getSignedUrlGetObject = async ({
  bucket,
  filename,
  expiresIn,
}: GetObjectSignedUrlProps) =>
  await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: bucket, Key: filename }),
    { expiresIn },
  );

export const getSignedUrlPutObject = async ({
  bucket,
  filename,
}: PutObjectSignedUrlProps) =>
  await getSignedUrl(
    s3Client,
    new PutObjectCommand({ Bucket: bucket, Key: filename, ACL: "public-read" }),
    { expiresIn: 3600 },
  );
