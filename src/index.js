import { AwsClient } from 'aws4fetch';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const objectKey = url.pathname.replace(/^\/+/, '');

		if (!objectKey) {
			return new Response('Not Found', { status: 404 });
		}

		const aws = new AwsClient({
			accessKeyId: env.IDRIVE_ACCESS_KEY,
			secretAccessKey: env.IDRIVE_SECRET_KEY,
			region: env.IDRIVE_REGION,
			service: 's3',
		});

		const s3Url = `https://${env.IDRIVE_BUCKET}.${env.IDRIVE_REGION}.idrivee2.com/${objectKey}`;

		const s3Response = await aws.fetch(s3Url);

		return new Response(s3Response.body, {
			headers: {
				'Content-Type': s3Response.headers.get('Content-Type') ?? 'application/octet-stream',
				'Cache-Control': 'public, max-age=31536000',
			},
		});
	},
};
