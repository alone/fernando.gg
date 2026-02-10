import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import {
	ADMIN_USERNAME_MIN_LENGTH,
	AUTH_SECRET_MIN_LENGTH,
	DATABASE_URL_PREFIXES,
} from "./constants";

export const env = createEnv({
	server: {
		DATABASE_URL: z
			.string()
			.min(1, "DATABASE_URL is required")
			.refine(
				(val) => DATABASE_URL_PREFIXES.some((prefix) => val.startsWith(prefix)),
				`DATABASE_URL must start with ${DATABASE_URL_PREFIXES.join(" or ")}`
			),
		BETTER_AUTH_SECRET: z
			.string()
			.min(
				AUTH_SECRET_MIN_LENGTH,
				`BETTER_AUTH_SECRET must be at least ${AUTH_SECRET_MIN_LENGTH} characters`
			),
		BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL"),
		CORS_ORIGIN: z.url("CORS_ORIGIN must be a valid URL"),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		GITHUB_REPO: z.string().optional(),
		GITHUB_BRANCH: z.string().default("main"),
		GITHUB_TOKEN: z.string().optional(),
		S3_BUCKET: z.string().optional(),
		S3_REGION: z.string().default("auto"),
		S3_ENDPOINT: z.string().optional(),
		S3_ACCESS_KEY_ID: z.string().optional(),
		S3_SECRET_ACCESS_KEY: z.string().optional(),
		S3_PUBLIC_URL: z.string().optional(),
		ADMIN_USERNAME: z
			.string()
			.min(
				ADMIN_USERNAME_MIN_LENGTH,
				"ADMIN_USERNAME is required and cannot be empty"
			),
	},
	runtimeEnv: Bun.env,
	emptyStringAsUndefined: true,
});

const criticalEnvSchema = z.object({
	DATABASE_URL: z
		.string("DATABASE_URL is missing")
		.refine(
			(val) => DATABASE_URL_PREFIXES.some((prefix) => val.startsWith(prefix)),
			`DATABASE_URL must start with ${DATABASE_URL_PREFIXES.join(" or ")}`
		),
	BETTER_AUTH_SECRET: z
		.string("BETTER_AUTH_SECRET is missing")
		.min(
			AUTH_SECRET_MIN_LENGTH,
			`BETTER_AUTH_SECRET must be at least ${AUTH_SECRET_MIN_LENGTH} characters`
		),
	BETTER_AUTH_URL: z
		.string("BETTER_AUTH_URL is missing")
		.url("BETTER_AUTH_URL must be a valid URL"),
	CORS_ORIGIN: z
		.string("CORS_ORIGIN is missing")
		.url("CORS_ORIGIN must be a valid URL"),
	ADMIN_USERNAME: z
		.string("ADMIN_USERNAME is missing")
		.min(ADMIN_USERNAME_MIN_LENGTH, "ADMIN_USERNAME cannot be empty"),
});

export function validateCriticalEnv(): void {
	const result = criticalEnvSchema.safeParse({
		DATABASE_URL: env.DATABASE_URL,
		BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: env.BETTER_AUTH_URL,
		CORS_ORIGIN: env.CORS_ORIGIN,
		ADMIN_USERNAME: env.ADMIN_USERNAME,
	});

	if (!result.success) {
		const errors = result.error.flatten().fieldErrors;

		console.error("\n╔══════════════════════════════════════════════╗");
		console.error("║  FATAL: Environment validation failed        ║");
		console.error("╚══════════════════════════════════════════════╝\n");

		for (const [field, messages] of Object.entries(errors)) {
			if (messages) {
				for (const msg of messages) {
					console.error(`  ✗ ${field}: ${msg}`);
				}
			}
		}

		console.error(
			"\nThe server cannot start without these variables. Check your .env file.\n"
		);
		process.exit(1);
	}

	const warnings: string[] = [];

	if (!env.GITHUB_REPO) {
		warnings.push(
			"GITHUB_REPO is not set — blog/project content will use mock data"
		);
	}

	const s3Vars = [
		env.S3_BUCKET,
		env.S3_ENDPOINT,
		env.S3_ACCESS_KEY_ID,
		env.S3_SECRET_ACCESS_KEY,
	];
	const s3Set = s3Vars.filter(Boolean).length;
	if (s3Set > 0 && s3Set < s3Vars.length) {
		warnings.push(
			"S3 is partially configured — set all of S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY for image uploads"
		);
	} else if (s3Set === 0) {
		warnings.push("S3 is not configured — image uploads will be unavailable");
	}

	if (warnings.length > 0) {
		console.warn("\n⚠  Environment warnings:");
		for (const w of warnings) {
			console.warn(`   • ${w}`);
		}
		console.warn("");
	}
}
