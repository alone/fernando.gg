import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	const { session } = Route.useRouteContext();

	return (
		<div className="px-8 py-10">
			<h1 className="mb-2 font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
				DASHBOARD
			</h1>
			<p className="mb-10 text-neutral-400 text-sm">
				Welcome back, {session.data?.user.name}.
			</p>

			<div className="grid gap-4 sm:grid-cols-2">
				<Link to="/admin/blog">
					<div className="border border-neutral-200 p-5 transition-colors hover:bg-neutral-50">
						<span className="mb-1 block font-pixel-square text-neutral-500 text-xs uppercase">
							Manage
						</span>
						<h2 className="mb-2 font-pixel-square text-sm">Blog Posts</h2>
						<p className="text-neutral-500 text-sm leading-relaxed">
							Create, edit, and manage your blog posts.
						</p>
					</div>
				</Link>
				<Link to="/admin/projects">
					<div className="border border-neutral-200 p-5 transition-colors hover:bg-neutral-50">
						<span className="mb-1 block font-pixel-square text-neutral-500 text-xs uppercase">
							Manage
						</span>
						<h2 className="mb-2 font-pixel-square text-sm">Projects</h2>
						<p className="text-neutral-500 text-sm leading-relaxed">
							Create, edit, and manage your projects.
						</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
