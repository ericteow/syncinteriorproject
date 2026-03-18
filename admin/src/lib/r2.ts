import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadToR2 = async (file: File): Promise<string> => {
  const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
  const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
  const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
  const publicDomain = import.meta.env.VITE_R2_PUBLIC_DOMAIN;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicDomain) {
    throw new Error("Cloudflare R2 credentials are missing or incomplete. Ask Admin to provide them in .env");
  }

  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const uniqueFileName = `projects/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
  
  try {
    await S3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: file,
        ContentType: file.type,
      })
    );
    // Remove trailing slash from domain if it exists
    const domain = publicDomain.replace(/\/$/, '');
    return `${domain}/${uniqueFileName}`;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};
