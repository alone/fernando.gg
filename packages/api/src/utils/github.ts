import { env } from "@fernando/env/server";

interface CacheEntry {
	content: string;
	fetchedAt: number;
}

const MAX_CACHE_SIZE = 500;
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getFromCache(key: string): string | undefined {
	const entry = cache.get(key);
	if (!entry) {
		return undefined;
	}

	if (Date.now() - entry.fetchedAt >= CACHE_TTL_MS) {
		cache.delete(key);
		return undefined;
	}

	cache.delete(key);
	cache.set(key, entry);
	return entry.content;
}

function setCache(key: string, content: string) {
	if (cache.size >= MAX_CACHE_SIZE) {
		const lru = cache.keys().next().value;
		if (lru) {
			cache.delete(lru);
		}
	}
	cache.set(key, { content, fetchedAt: Date.now() });
}

const inFlight = new Map<string, Promise<string>>();

async function fetchFromGithubInternal(githubPath: string): Promise<string> {
	const encodedPath = githubPath
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");

	const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${encodedPath}?ref=${env.GITHUB_BRANCH}`;

	const headers: Record<string, string> = {
		Accept: "application/vnd.github.raw+json",
	};
	if (env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
	}

	console.log(`[github] Fetching: ${url}`);

	const response = await fetch(url, { headers });

	if (!response.ok) {
		throw new Error(
			`Failed to fetch markdown from GitHub: ${response.status} ${response.statusText} (${url})`
		);
	}

	const content = await response.text();

	setCache(githubPath, content);

	return content;
}

export async function fetchMarkdownFromGithub(
	githubPath: string
): Promise<string> {
	if (!env.GITHUB_REPO) {
		throw new Error(
			"GITHUB_REPO is not configured. Set it in your environment variables."
		);
	}

	const cached = getFromCache(githubPath);
	if (cached) {
		return cached;
	}

	const existing = inFlight.get(githubPath);
	if (existing) {
		return await existing;
	}

	const promise = fetchFromGithubInternal(githubPath).finally(() => {
		inFlight.delete(githubPath);
	});
	inFlight.set(githubPath, promise);
	return await promise;
}

export function invalidateGithubCache(githubPath?: string) {
	if (githubPath) {
		cache.delete(githubPath);
	} else {
		cache.clear();
	}
}
