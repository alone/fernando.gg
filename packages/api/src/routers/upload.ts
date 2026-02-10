import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@fernando/env/server";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { MAX_UPLOAD_SIZE_BYTES } from "../constants";
import { adminProcedure, router } from "../index";

const ALLOWED_MIME_TYPES = [
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
] as const;

const MIME_TO_EXT: Record<string, string> = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/gif": "gif",
	"image/webp": "webp",
};

const uploadInputSchema = z.object({
	base64: z
		.string()
		.min(1, "File data is required")
		.refine(
			(val) => Math.ceil(val.length * 0.75) <= MAX_UPLOAD_SIZE_BYTES,
			`File is too large. Maximum size is ${MAX_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`
		),
	mimeType: z.enum(ALLOWED_MIME_TYPES, {
		error: `File type not allowed. Accepted: ${ALLOWED_MIME_TYPES.join(", ")}`,
	}),
});

function getS3Client(): S3Client {
	if (
		!(
			env.S3_BUCKET &&
			env.S3_ENDPOINT &&
			env.S3_ACCESS_KEY_ID &&
			env.S3_SECRET_ACCESS_KEY &&
			env.S3_PUBLIC_URL
		)
	) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Image upload is not configured. Set S3 environment variables.",
		});
	}

	const s3Client = new S3Client({
		region: env.S3_REGION,
		endpoint: env.S3_ENDPOINT,
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY,
		},
		forcePathStyle: true,
	});

	return s3Client;
}

export const uploadRouter = router({
	image: adminProcedure.input(uploadInputSchema).mutation(async ({ input }) => {
		const { base64, mimeType } = input;
		const ext = MIME_TO_EXT[mimeType];
		const buffer = Buffer.from(base64, "base64");

		const filename = `${crypto.randomUUID()}.${ext}`;
		const key = `uploads/${filename}`;

		const client = getS3Client();

		await client.send(
			new PutObjectCommand({
				Bucket: env.S3_BUCKET,
				Key: key,
				Body: buffer,
				ContentType: mimeType,
			})
		);

		const url = `${env.S3_PUBLIC_URL}/${key}`;

		return { url };
	}),
});
