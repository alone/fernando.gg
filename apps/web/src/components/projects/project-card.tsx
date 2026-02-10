import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export interface ProjectItem {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	tag: string;
	stack: string[];
}

interface ProjectCardProps {
	project: ProjectItem;
	index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			key={project.id}
			transition={{
				duration: 0.45,
				delay: index * 0.06,
			}}
			viewport={{ once: true }}
			whileInView={{ opacity: 1, y: 0 }}
		>
			<Link
				className="group block border border-neutral-200 p-5 transition-colors hover:bg-neutral-50"
				params={{ slug: project.slug }}
				to="/projects/$slug"
			>
				<span className="mb-3 block font-pixel-square text-neutral-600 text-xs uppercase">
					{project.tag}
				</span>
				<h3 className="mb-2 font-pixel-square text-sm">{project.title}</h3>
				{project.description && (
					<p className="mb-4 line-clamp-3 text-neutral-500 text-sm leading-relaxed">
						{project.description}
					</p>
				)}
				{project.stack.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{project.stack.map((s) => (
							<span
								className="border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-400 uppercase"
								key={s}
							>
								{s}
							</span>
						))}
					</div>
				)}
			</Link>
		</motion.div>
	);
}
