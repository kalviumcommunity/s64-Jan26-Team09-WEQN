import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Assignment 2.39: Object Storage Configuration (AWS S3)
 * 
 * SECURITY NOTES:
 * 1. Principle of Least Privilege: The IAM user associated with these credentials
 *    should only have the following permissions:
 *    - s3:PutObject
 *    - s3:GetObject
 *    - s3:DeleteObject (optional)
 *    Restricted to the specific bucket defined in S3_BUCKET_NAME.
 * 
 * 2. Why Public Buckets are Insecure:
 *    Public buckets allow anyone to read sensitive patient data (Pii/Phi), 
 *    leading to data breaches and compliance violations (HIPAA/GDPR).
 *    Always keep buckets PRIVATE and use pre-signed URLs for access.
 * 
 * 3. Pre-signed URLs: 
 *    These provide temporary, time-limited access to specific objects without 
 *    exposing your long-term AWS credentials or making files public.
 */

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  console.warn('⚠️ AWS S3 configuration is incomplete. Storage features may fail.');
}

// S3 Client Configuration (SDK v3)
export const s3Client = new S3Client({
  region: region || 'us-east-1',
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

/**
 * Generates a pre-signed URL for uploading a file to S3.
 * @param key The destination path/filename in the bucket
 * @param contentType The MIME type of the file
 * @param expiresIn Time in seconds until the URL expires (default 120s)
 */
export async function getUploadPresignedUrl(
  key: string, 
  contentType: string, 
  expiresIn = 120
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generates a pre-signed URL for downloading/viewing a file from S3.
 * Useful for private buckets where files are not public.
 * @param key The path/filename in the bucket
 * @param expiresIn Time in seconds until the URL expires (default 3600s / 1h)
 */
export async function getDownloadPresignedUrl(
  key: string, 
  expiresIn = 3600
) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}
