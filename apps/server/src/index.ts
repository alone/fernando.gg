import { createContext } from "@fernando/api/context";
import { appRouter } from "@fernando/api/routers/index";
import { auth } from "@fernando/auth";
import { env, validateCriticalEnv } from "@fernando/env/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { HTTP_STATUS_NO_CONTENT, SERVER_PORT } from "./constants";

validateCriticalEnv();

const CORS_HEADERS: Record<string, string> = {
	"Access-Control-Allow-Origin": env.CORS_ORIGIN,
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Allow-Credentials": "true",
};

function withCors(res: Response): Response {
	for (const [key, value] of Object.entries(CORS_HEADERS)) {
		res.headers.set(key, value);
	}
	return res;
}

Bun.serve({
	port: SERVER_PORT,
	async fetch(req) {
		const url = new URL(req.url);

		if (req.method === "OPTIONS") {
			return new Response(null, {
				status: HTTP_STATUS_NO_CONTENT,
				headers: CORS_HEADERS,
			});
		}

		if (url.pathname.startsWith("/api/auth/")) {
			return withCors(await auth.handler(req));
		}

		if (url.pathname.startsWith("/trpc/")) {
			const res = await fetchRequestHandler({
				endpoint: "/trpc",
				router: appRouter,
				req,
				createContext: () => createContext({ req }),
			});
			return withCors(res);
		}

		return withCors(new Response("OK"));
	},
});

console.log(`Server is running on http://localhost:${SERVER_PORT}`);
