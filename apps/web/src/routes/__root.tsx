import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import {
	FAVICON_HREF,
	NOT_FOUND_IMAGE_SIZE,
	NOT_FOUND_IMAGE_SRC,
	THEME_STORAGE_KEY,
} from "@/lib/constants";
import type { trpc } from "@/utils/trpc";

import "../index.css";

export interface RouterAppContext {
	trpc: typeof trpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	head: () => ({
		meta: [
			{
				title: "fernando.gg",
			},
			{
				name: "description",
				content: "fernando's personal web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: FAVICON_HREF,
			},
		],
	}),
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<NuqsAdapter>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
					storageKey={THEME_STORAGE_KEY}
				>
					<div className="h-svh">
						<Outlet />
					</div>
					<Toaster />
				</ThemeProvider>
			</NuqsAdapter>
			<TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools buttonPosition="bottom-right" position="bottom" />
		</>
	);
}

function NotFoundComponent() {
	return (
		<div className="flex h-svh flex-col items-center justify-center bg-black px-6 text-center text-white">
			<img
				alt="404"
				className="mb-10 w-64 sm:w-80"
				draggable={false}
				height={NOT_FOUND_IMAGE_SIZE}
				src={NOT_FOUND_IMAGE_SRC}
				width={NOT_FOUND_IMAGE_SIZE}
			/>
			<h1 className="mb-4 font-pixel-square text-3xl tracking-tight sm:text-5xl">
				WRONG TURN, BUDDY.
			</h1>
			<p className="mb-2 max-w-md text-base text-neutral-400 leading-relaxed sm:text-lg">
				This page doesn't exist. It never did. Whatever you typed up there in
				the address bar is catastrophically, embarrassingly wrong.
			</p>
			<Link
				className="border border-neutral-700 px-6 py-3 font-pixel-square text-neutral-400 text-xs uppercase tracking-[0.2em] transition-colors hover:border-white hover:text-white"
				to="/"
			>
				Get me out of here
			</Link>
		</div>
	);
}
