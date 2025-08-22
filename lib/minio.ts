import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1", // dummy region
  endpoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // required for MinIO
});

export async function uploadImage(
  file: File,
  userId: string,
  fileName: string
): Promise<{ key: string; publicUrl: string }> {
  const key = `${userId}/${fileName}`;
  const arrayBuffer = await file.arrayBuffer();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: "user-images",
      Key: key,
      Body: new Uint8Array(arrayBuffer), // works in browser
      ContentType: file.type,
    })
  );

  const publicUrl = `https://minio.theblogrammer.com:9000/user-images/${key}`;
  return { key, publicUrl };
}