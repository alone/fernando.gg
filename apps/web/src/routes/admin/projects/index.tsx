import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { queryClient, trpc, trpcClient } from "@/utils/trpc";

export const Route = createFileRoute("/admin/projects/")({
	component: AdminProjectList,
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(trpc.project.listAll.queryOptions()),
});

function AdminProjectList() {
	const { data: projects, isLoading } = useQuery(
		trpc.project.listAll.queryOptions()
	);

	const deleteMutation = useMutation({
		mutationFn: (id: string) => trpcClient.project.delete.mutate({ id }),
		onSuccess: () => {
			toast.success("Project deleted");
			queryClient.invalidateQueries({
				queryKey: [["project"]],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	if (isLoading) {
		return (
			<div className="px-8 py-10">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
						PROJECTS
					</h1>
					<Link to="/admin/projects/new">
						<span className="inline-block border border-black bg-black px-3 py-2 font-pixel-square text-[10px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black sm:px-5 sm:py-2.5 sm:text-xs">
							New Project
						</span>
					</Link>
				</div>
				<div className="space-y-3">
					{["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
						<div
							className="animate-pulse border border-neutral-200 p-5"
							key={key}
						>
							<div className="h-4 w-1/2 bg-neutral-100" />
							<div className="mt-3 h-3 w-1/4 bg-neutral-100" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!projects || projects.length === 0) {
		return (
			<div className="px-8 py-10">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
						PROJECTS
					</h1>
					<Link to="/admin/projects/new">
						<span className="inline-block border border-black bg-black px-3 py-2 font-pixel-square text-[10px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black sm:px-5 sm:py-2.5 sm:text-xs">
							New Project
						</span>
					</Link>
				</div>
				<div className="border border-neutral-200 border-dashed p-8 text-center">
					<p className="text-neutral-400 text-sm">
						No projects yet. Create your first one.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-8 py-10">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="font-pixel-square text-xl leading-[0.85] tracking-tight sm:text-3xl">
					PROJECTS
				</h1>
				<Link to="/admin/projects/new">
					<span className="inline-block border border-black bg-black px-3 py-2 font-pixel-square text-[10px] text-white uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-black sm:px-5 sm:py-2.5 sm:text-xs">
						New Project
					</span>
				</Link>
			</div>

			<div className="space-y-3">
				{projects.map((proj) => (
					<div
						className="flex items-center justify-between border border-neutral-200 p-5"
						key={proj.id}
					>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-3">
								<h2 className="truncate font-pixel-square text-sm">
									{proj.title}
								</h2>
								<span className="shrink-0 border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-400 uppercase">
									{proj.tag}
								</span>
							</div>
							<p className="mt-1 text-neutral-400 text-xs">
								{proj.slug}
								{proj.stack.length > 0 && (
									<> &middot; {proj.stack.join(", ")}</>
								)}
							</p>
						</div>
						<div className="ml-4 flex shrink-0 items-center gap-2">
							<Link params={{ id: proj.id }} to="/admin/projects/$id/edit">
								<span className="inline-block border border-neutral-200 px-3 py-1.5 text-xs uppercase tracking-wider transition-colors hover:bg-neutral-50">
									Edit
								</span>
							</Link>
							<button
								className="border border-red-200 px-3 py-1.5 text-red-500 text-xs uppercase tracking-wider transition-colors hover:bg-red-50 disabled:opacity-40"
								disabled={deleteMutation.isPending}
								onClick={() => deleteMutation.mutate(proj.id)}
								type="button"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
