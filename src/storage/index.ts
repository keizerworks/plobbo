import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst/resource";

export const s3Client = new S3Client({ region: "us-east-1" });

interface PutObjectSignedUrlProps {
    filename: string;
}

interface GetObjectSignedUrlProps extends PutObjectSignedUrlProps {
    expiresIn?: number;
}

export const getSignedUrlGetObject = async ({
    filename,
    expiresIn,
}: GetObjectSignedUrlProps) =>
    await getSignedUrl(
        s3Client,
        new GetObjectCommand({
            Bucket: Resource.bucket.name,
            Key: filename,
        }),
        { expiresIn },
    );

export const getSignedUrlPutObject = async ({
    filename,
}: PutObjectSignedUrlProps) => {
    const command = new PutObjectCommand({
        Bucket: Resource.bucket.name,
        Key: filename,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
