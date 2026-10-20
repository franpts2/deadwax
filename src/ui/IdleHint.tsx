export function IdleHint({ hidden }: { hidden: boolean }) {
	return (
		<div
			className={`absolute inset-x-0 bottom-7 flex justify-center transition-opacity duration-500 ${
				hidden ? "opacity-0" : "opacity-100"
			}`}
		>
			<p className="text-[10px] uppercase tracking-[0.26em] text-ink-faint">
				Drag to browse
				<span className="mx-2.5 text-white/15">/</span>
				Click a record to pull it out
			</p>
		</div>
	)
}
