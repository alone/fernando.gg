import { auth } from "@fernando/auth";
import { db } from "@fernando/db";
import { sql } from "drizzle-orm";

import { MIN_PASSWORD_LENGTH } from "./constants";

const username = Bun.argv[2];
const password = Bun.argv[3];

if (!(username && password)) {
	console.error("Usage: bun run seed <username> <password>");
	process.exit(1);
}

if (password.length < MIN_PASSWORD_LENGTH) {
	console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
	process.exit(1);
}

const existing = await db.query.user.findFirst();
if (existing) {
	console.log("Existing account found, clearing...");
	await db.transaction(async (tx) => {
		await tx.execute(sql`DELETE FROM "session"`);
		await tx.execute(sql`DELETE FROM "account"`);
		await tx.execute(sql`DELETE FROM "user"`);
	});
}

const result = await auth.api.signUpEmail({
	body: {
		name: username,
		username,
		email: `${username}@noreply.fernando.gg`,
		password,
	},
});

if (!result?.user) {
	console.error("Failed to create admin account");
	process.exit(1);
}

const created = await db.query.user.findFirst();
if (created && !created.username) {
	console.log("Username not set by plugin, setting manually...");
	await db.execute(
		sql`UPDATE "user" SET "username" = ${username}, "display_username" = ${username} WHERE "id" = ${created.id}`
	);
}

const final = await db.query.user.findFirst();
console.log("Created user:", JSON.stringify(final, null, 2));

console.log("\nTesting sign-in with email...");
try {
	const emailResult = await auth.api.signInEmail({
		body: {
			email: `${username}@noreply.fernando.gg`,
			password,
		},
	});
	console.log("Email sign-in:", emailResult?.user ? "OK" : "FAILED");
} catch (e: unknown) {
	console.error("Email sign-in error:", e instanceof Error ? e.message : e);
}

console.log("Testing sign-in with username...");
try {
	const usernameResult = await auth.api.signInUsername({
		body: {
			username,
			password,
		},
	});
	console.log("Username sign-in:", usernameResult?.user ? "OK" : "FAILED");
} catch (e: unknown) {
	console.error("Username sign-in error:", e instanceof Error ? e.message : e);
}

console.log(`\nAdmin account "${username}" created successfully`);
process.exit(0);
