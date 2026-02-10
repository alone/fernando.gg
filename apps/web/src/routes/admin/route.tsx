import { ArticleIcon } from "@phosphor-icons/react/dist/csr/Article";
import { FolderSimpleIcon } from "@phosphor-icons/react/dist/csr/FolderSimple";
import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/restricted",
				throw: true,
			});
		}
		return { session };
	},
	component: AdminLayout,
});

const navLinks: {
	to: string;
	label: string;
	icon: Icon;
}[] = [
	{ to: "/admin/blog", label: "Blog", icon: ArticleIcon },
	{ to: "/admin/projects", label: "Projects", icon: FolderSimpleIcon },
];

function AdminLayout() {
	const navigate = useNavigate();
	const { session } = Route.useRouteContext();
	const [menuOpen, setMenuOpen] = useState(false);

	function handleSignOut() {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/" });
				},
			},
		});
	}

	const sidebarContent = (
		<>
			<div className="px-5 pt-6 pb-4">
				<Link
					className="font-pixel-square text-lg leading-[0.85] tracking-tight"
					onClick={() => setMenuOpen(false)}
					to="/admin"
				>
					ADMIN
				</Link>
			</div>

			<nav className="flex flex-1 flex-col gap-1.5 px-3">
				{navLinks.map((link) => {
					const Icon = link.icon;
					return (
						<Link
							activeOptions={{ exact: link.to === "/admin" }}
							activeProps={{
								className: "[&]:border-black [&]:text-black",
							}}
							className="flex items-center gap-2.5 border border-transparent px-3 py-2 font-pixel-square text-black text-xs uppercase tracking-wider transition-colors"
							key={link.to}
							onClick={() => setMenuOpen(false)}
							to={link.to}
						>
							<Icon className="size-4 shrink-0" weight="thin" />
							{link.label}
						</Link>
					);
				})}
			</nav>

			<div className="border-neutral-200 border-t px-5 py-4">
				<p className="mb-2 truncate font-pixel-square text-neutral-500 text-xs uppercase">
					{session.data?.user.name}
				</p>
				<button
					className="w-full border border-neutral-200 px-3 py-1.5 font-pixel-square text-neutral-500 text-xs uppercase tracking-wider transition-colors hover:border-red-200 hover:text-red-500"
					onClick={handleSignOut}
					type="button"
				>
					Sign Out
				</button>
			</div>
		</>
	);

	return (
		<div className="flex min-h-svh bg-white text-black">
			<aside className="hidden w-56 shrink-0 flex-col border-neutral-200 border-r md:flex">
				{sidebarContent}
			</aside>

			<div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-neutral-200 border-b bg-white px-4 py-3 md:hidden">
				<Link
					className="font-pixel-square text-sm leading-[0.85] tracking-tight"
					to="/admin"
				>
					ADMIN
				</Link>
				<button
					className="text-black"
					onClick={() => setMenuOpen(!menuOpen)}
					type="button"
				>
					{menuOpen ? (
						<XIcon className="size-5" />
					) : (
						<ListIcon className="size-5" />
					)}
				</button>
			</div>

			{menuOpen && (
				<>
					<button
						className="fixed inset-0 z-40 bg-black/40 md:hidden"
						onClick={() => setMenuOpen(false)}
						tabIndex={-1}
						type="button"
					>
						<span className="sr-only">Close menu</span>
					</button>
					<aside className="fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-neutral-200 border-r bg-white md:hidden">
						<div className="flex items-center justify-between px-5 pt-6 pb-4">
							<Link
								className="font-pixel-square text-lg leading-[0.85] tracking-tight"
								onClick={() => setMenuOpen(false)}
								to="/admin"
							>
								ADMIN
							</Link>
							<button
								className="text-black"
								onClick={() => setMenuOpen(false)}
								type="button"
							>
								<XIcon className="size-5" />
							</button>
						</div>

						<nav className="flex flex-1 flex-col gap-1.5 px-3">
							{navLinks.map((link) => {
								const Icon = link.icon;
								return (
									<Link
										activeOptions={{ exact: link.to === "/admin" }}
										activeProps={{
											className: "[&]:border-black [&]:text-black",
										}}
										className="flex items-center gap-2.5 border border-transparent px-3 py-2 font-pixel-square text-black text-xs uppercase tracking-wider transition-colors"
										key={link.to}
										onClick={() => setMenuOpen(false)}
										to={link.to}
									>
										<Icon className="size-4 shrink-0" weight="thin" />
										{link.label}
									</Link>
								);
							})}
						</nav>

						<div className="border-neutral-200 border-t px-5 py-4">
							<p className="mb-2 truncate font-pixel-square text-neutral-500 text-xs uppercase">
								{session.data?.user.name}
							</p>
							<button
								className="w-full border border-neutral-200 px-3 py-1.5 font-pixel-square text-neutral-500 text-xs uppercase tracking-wider transition-colors hover:border-red-200 hover:text-red-500"
								onClick={handleSignOut}
								type="button"
							>
								Sign Out
							</button>
						</div>
					</aside>
				</>
			)}

			<main className="flex-1 overflow-y-auto pt-12 md:pt-0">
				<Outlet />
			</main>
		</div>
	);
}
