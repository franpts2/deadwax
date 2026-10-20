export function Header({ count }: { count: number }) {
	return (
		<header className="absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-8">
			<div>
				<div className="flex items-center gap-2.5">
					<span className="h-1.5 w-1.5 rounded-full bg-amber" />
					<span className="text-[10px] font-medium uppercase tracking-[0.34em] text-ink">
						Vinyl Shelf
					</span>
				</div>
				<p className="mt-2.5 text-[11px] tracking-wide text-ink-faint">{count} records · one shelf</p>
			</div>

			<div className="hidden text-right sm:block">
				<p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">Collection 001</p>
				<p className="mt-2 text-[11px] tracking-wide text-ink-faint/70">Est. MMXXVI</p>
			</div>
		</header>
	)
}
