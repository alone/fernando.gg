import { motion } from "framer-motion";

export default function SiteFooter() {
	const socials = [
		{
			label: "Email",
			value: "hello@fernando.gg",
			href: "mailto:hello@fernando.gg",
		},
		{
			label: "Github",
			value: "github.com/alone",
			href: "https://github.com/alone",
			external: true,
		},
		{
			label: "Twitter",
			value: "@f2",
		},
	];

	return (
		<>
			<section className="px-6 py-16 sm:py-24" id="contact">
				<div className="mx-auto max-w-4xl">
					<motion.h2
						className="mb-8 font-pixel-square text-[clamp(2rem,6vw,5rem)] leading-[0.9]"
						initial={{ opacity: 0, y: 30 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, y: 0 }}
					>
						MYSELF
					</motion.h2>
					<motion.p
						className="mb-12 w-full text-neutral-400 text-sm leading-relaxed sm:text-base"
						initial={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1 }}
					>
						I like building things that feel solid. Full-stack applications,
						developer tools, security research — whatever the project, the bar
						is the same: fast, clean, resilient.
					</motion.p>
					<div className="grid gap-6 text-sm sm:grid-cols-3">
						{socials.map((social, i) => {
							const inner = (
								<>
									<span className="mb-1 block text-neutral-600 text-xs uppercase">
										{social.label}
									</span>
									<span className="transition-colors group-hover:text-white">
										{social.value}
									</span>
								</>
							);

							return (
								<motion.div
									initial={{ opacity: 0, y: 15 }}
									key={social.label}
									transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
									viewport={{ once: true }}
									whileInView={{ opacity: 1, y: 0 }}
								>
									{social.href ? (
										<a
											className="group block border-neutral-800 border-t pt-4 text-neutral-400"
											href={social.href}
											rel={social.external ? "noopener noreferrer" : undefined}
											target={social.external ? "_blank" : undefined}
										>
											{inner}
										</a>
									) : (
										<div className="border-neutral-800 border-t pt-4 text-neutral-400">
											{inner}
										</div>
									)}
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>
			<motion.footer
				className="px-6 py-6"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.4 }}
				viewport={{ once: true }}
				whileInView={{ opacity: 1 }}
			>
				<div className="mx-auto max-w-4xl text-left text-neutral-600 text-xs">
					&copy; {new Date().getFullYear()} fernando.gg
				</div>
			</motion.footer>
		</>
	);
}
