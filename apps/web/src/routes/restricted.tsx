import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/components/sign-in-form";
import {
	BANNER_IMAGE_HEIGHT,
	BANNER_IMAGE_WIDTH,
	LOGIN_BANNER_IMAGE_SRC,
} from "@/lib/constants";

export const Route = createFileRoute("/restricted")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative flex min-h-svh items-center justify-center bg-black px-6 py-16 text-white">
			<img
				alt=""
				className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
				height={BANNER_IMAGE_HEIGHT}
				src={LOGIN_BANNER_IMAGE_SRC}
				width={BANNER_IMAGE_WIDTH}
			/>
			<div className="pointer-events-none absolute inset-0 bg-black/60" />
			<div className="relative w-full max-w-sm border border-neutral-200 bg-white p-8 text-black">
				<h1 className="mb-2 font-pixel-square text-3xl leading-[0.85] tracking-tight">
					SIGN IN
				</h1>
				<p className="mb-2 text-neutral-400 text-sm">
					Restricted area. Don't sign in if you aren't me.
				</p>
				<SignInForm />
			</div>
		</div>
	);
}
