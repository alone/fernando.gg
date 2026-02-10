import { Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type MarkdownResult, renderMarkdown } from "@/utils/markdown";

interface MarkdownProps {
	content: string;
	className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
	const [result, setResult] = useState<MarkdownResult | null>(null);

	useEffect(() => {
		renderMarkdown(content).then(setResult);
	}, [content]);

	if (!result) {
		return (
			<div className={cn("animate-pulse", className)}>
				<div className="h-4 w-3/4 rounded bg-muted" />
				<div className="mt-3 h-4 w-1/2 rounded bg-muted" />
				<div className="mt-3 h-4 w-5/6 rounded bg-muted" />
			</div>
		);
	}

	return (
		<div className={cn("prose dark:prose-invert max-w-none", className)}>
			{parse(result.markup, {
				replace: (domNode) => {
					if (!("attribs" in domNode)) {
						return undefined;
					}

					if (domNode.name === "a") {
						const href = domNode.attribs.href;
						if (href?.startsWith("/")) {
							return (
								<Link className={domNode.attribs.class} to={href}>
									{domNode.children?.map((child) =>
										"data" in child ? (
											<span key={child.data}>{child.data}</span>
										) : null
									)}
								</Link>
							);
						}
						if (href?.startsWith("http")) {
							return (
								<a
									className={domNode.attribs.class}
									href={href}
									rel="noopener noreferrer"
									target="_blank"
								>
									{domNode.children?.map((child) =>
										"data" in child ? (
											<span key={child.data}>{child.data}</span>
										) : null
									)}
								</a>
							);
						}
					}
					if (domNode.name === "img") {
						return (
							<img
								alt={domNode.attribs.alt ?? ""}
								className={cn("rounded-lg", domNode.attribs.class)}
								height={domNode.attribs.height || undefined}
								loading="lazy"
								src={domNode.attribs.src}
								width={domNode.attribs.width || undefined}
							/>
						);
					}

					return undefined;
				},
			})}
		</div>
	);
}
