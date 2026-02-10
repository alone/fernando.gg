import { AnimatePresence, motion } from "framer-motion";

interface FilterModalProps {
	filterOpen: boolean;
	setFilterOpen: (open: boolean) => void;
	tag: string | null;
	stack: string | null;
	tags: string[];
	stacks: string[];
	activeFilterCount: number;
	projectCount: number;
	setFilter: (updates: {
		tag?: string | null;
		stack?: string | null;
		pageSize?: number | null;
	}) => void;
}

export function FilterModal({
	filterOpen,
	setFilterOpen,
	tag,
	stack,
	tags,
	stacks,
	activeFilterCount,
	projectCount,
	setFilter,
}: FilterModalProps) {
	if (projectCount === 0) {
		return null;
	}

	return (
		<>
			<div className="mb-6 flex items-center justify-end">
				<button
					className={`relative flex items-center gap-2 border px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
						filterOpen || activeFilterCount > 0
							? "border-black bg-black text-white"
							: "border-neutral-300 text-neutral-500 hover:border-black hover:text-black"
					}`}
					onClick={() => setFilterOpen(!filterOpen)}
					type="button"
				>
					<svg
						aria-hidden="true"
						className="h-3.5 w-3.5"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						<title>Filter</title>
						<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
					</svg>
					<span className="font-pixel-square">Filter</span>
					{activeFilterCount > 0 && (
						<span className="flex h-4 w-4 items-center justify-center bg-white text-[10px] text-black">
							{activeFilterCount}
						</span>
					)}
				</button>
			</div>

			<AnimatePresence>
				{filterOpen && (
					<>
						<motion.div
							animate={{ opacity: 1 }}
							className="fixed inset-0 z-40 hidden bg-black/60 backdrop-blur-sm sm:block"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onClick={() => setFilterOpen(false)}
							transition={{ duration: 0.2 }}
						/>

						<motion.div
							animate={{ opacity: 1, y: 0, scale: 1 }}
							className="fixed inset-0 z-50 flex flex-col bg-black text-white sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:border sm:border-neutral-800"
							exit={{ opacity: 0, y: 20, scale: 0.97 }}
							initial={{ opacity: 0, y: 20, scale: 0.97 }}
							transition={{ duration: 0.25, ease: "easeOut" }}
						>
							<div className="flex items-center justify-between border-neutral-800 border-b px-6 py-5">
								<h2 className="font-pixel-square text-sm uppercase tracking-[0.15em]">
									Filters
								</h2>
								<button
									className="cursor-pointer font-pixel-square text-neutral-400 text-xs uppercase tracking-[0.15em] transition-colors hover:text-white"
									onClick={() => setFilterOpen(false)}
									type="button"
								>
									&times;
								</button>
							</div>

							<div className="flex-1 overflow-y-auto px-6 py-8">
								<div className="mb-10">
									<span className="mb-4 block font-pixel-square text-neutral-500 text-xs uppercase tracking-[0.2em]">
										Category
									</span>
									<div className="flex flex-wrap gap-2">
										<button
											className={`border px-4 py-2 text-sm transition-colors ${
												tag
													? "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
													: "border-white bg-white text-black"
											}`}
											onClick={() => setFilter({ tag: null })}
											type="button"
										>
											All
										</button>
										{tags.map((t) => (
											<button
												className={`border px-4 py-2 text-sm transition-colors ${
													tag === t
														? "border-white bg-white text-black"
														: "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
												}`}
												key={t}
												onClick={() =>
													setFilter({
														tag: tag === t ? null : t,
													})
												}
												type="button"
											>
												{t}
											</button>
										))}
									</div>
								</div>

								{stacks.length > 0 && (
									<div className="mb-10">
										<span className="mb-4 block font-pixel-square text-neutral-500 text-xs uppercase tracking-[0.2em]">
											Stack
										</span>
										<div className="flex flex-wrap gap-2">
											{stacks.map((s) => (
												<button
													className={`border px-4 py-2 text-sm transition-colors ${
														stack === s
															? "border-white bg-white text-black"
															: "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
													}`}
													key={s}
													onClick={() =>
														setFilter({
															stack: stack === s ? null : s,
														})
													}
													type="button"
												>
													{s}
												</button>
											))}
										</div>
									</div>
								)}
							</div>

							<div className="flex items-center justify-between border-neutral-800 border-t px-6 py-5">
								{activeFilterCount > 0 ? (
									<button
										className="font-pixel-square text-neutral-400 text-xs uppercase tracking-[0.15em] underline underline-offset-2 transition-colors hover:text-white"
										onClick={() =>
											setFilter({
												tag: null,
												stack: null,
											})
										}
										type="button"
									>
										Clear all
									</button>
								) : (
									<span />
								)}
								<button
									className="border border-white bg-white px-6 py-2.5 font-pixel-square text-black text-xs uppercase tracking-[0.15em] transition-colors hover:bg-neutral-200"
									onClick={() => setFilterOpen(false)}
									type="button"
								>
									Show results
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{!filterOpen && activeFilterCount > 0 && (
				<div className="mb-6 flex flex-wrap items-center gap-2">
					{tag && (
						<span className="flex items-center gap-1.5 border border-neutral-200 px-2.5 py-1 text-neutral-600 text-xs">
							{tag}
							<button
								className="text-neutral-400 transition-colors hover:text-black"
								onClick={() => setFilter({ tag: null })}
								type="button"
							>
								&times;
							</button>
						</span>
					)}
					{stack && (
						<span className="flex items-center gap-1.5 border border-neutral-200 px-2.5 py-1 text-neutral-600 text-xs">
							{stack}
							<button
								className="text-neutral-400 transition-colors hover:text-black"
								onClick={() => setFilter({ stack: null })}
								type="button"
							>
								&times;
							</button>
						</span>
					)}
				</div>
			)}
		</>
	);
}
