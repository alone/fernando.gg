import { env } from "@fernando/env/server";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import {
	account,
	accountRelations,
	post,
	postRelations,
	project,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
} from "./schema";

const client = new SQL(env.DATABASE_URL);

export const db = drizzle({
	client,
	schema: {
		account,
		accountRelations,
		post,
		postRelations,
		project,
		session,
		sessionRelations,
		user,
		userRelations,
		verification,
	},
});
