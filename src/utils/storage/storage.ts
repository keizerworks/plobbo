import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT || "http://localhost:9000", 
    region: process.env.S3_REGION || "ap-south-1", 
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin", 
        secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
    }, 
    forcePathStyle: true,
})

const bucketName = process.env.S3_BUCKET || "favicons"; 

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });
  
    await s3Client.send(command);
    
    return `${process.env.S3_PUBLIC_URL || "http://localhost:9000"}/${bucketName}/${fileName}`;
  }
  