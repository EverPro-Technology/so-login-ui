import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.S3_AWS_REGION,
    credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
    },
})

export interface AppConfiguration {
    login: { url: string }
    passwordReset: { url: string }
    sessionExchange: { url: string }
}

export async function getAppConfiguration(
    applicationName: string
): Promise<AppConfiguration> {
    const fetchCommand = new GetObjectCommand({
        Bucket: process.env.S3_AWS_BUCKET_NAME, Key: `${process.env.S3_AWS_CONFIG_FOLDER}/${applicationName}/application-configuration.json`
    });
    
    const {Body} = await s3.send(fetchCommand);
    if (!Body) {
        throw new Error('fetch failed');
    }

    const text = await new Response(Body as any).text();
    return JSON.parse(text);
}
