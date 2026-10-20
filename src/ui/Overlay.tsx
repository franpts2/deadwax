import { RECORDS } from "../data/records"
import { useShelf } from "../store/shelf"

const BLACK = "#0d0d10"

export function Overlay() {
	const selectedId = useShelf((state) => state.selectedId)
	const record = selectedId ? (RECORDS.find((item) => item.id === selectedId) ?? null) : null

	return (
		<div className="pointer-events-none fixed inset-0 z-50 select-none">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#07060a]/90 via-[#07060a]/35 to-transparent" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#07060a]/90 via-[#07060a]/35 to-transparent" />

			<header className="absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-8">
				<div>
					<div className="flex items-center gap-2.5">
						<span className="h-1.5 w-1.5 rounded-full bg-amber" />
						<span className="text-[10px] font-medium uppercase tracking-[0.34em] text-ink">
							Vinyl Shelf
						</span>
					</div>
					<p className="mt-2.5 text-[11px] tracking-wide text-ink-faint">
						{RECORDS.length} records · one shelf
					</p>
				</div>

				<div className="hidden text-right sm:block">
					<p className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">Collection 001</p>
					<p className="mt-2 text-[11px] tracking-wide text-ink-faint/70">Est. MMXXVI</p>
				</div>
			</header>

			{/* Selection card */}
			<div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
				<div
					className={`w-[min(400px,42vw)] rounded-lg border border-white/8 bg-[#0a090b]/55 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] backdrop-blur-md transition-all duration-500 ease-out ${
						record
							? "translate-y-0 opacity-100"
							: "pointer-events-none translate-y-5 opacity-0"
					}`}
				>
					{record && (
						<>
							<p className="text-[10px] uppercase tracking-[0.3em] text-amber/90">{record.artist}</p>
							<h2 className="mt-2 font-display text-[34px] leading-[0.95] text-ink md:text-[40px]">
								{record.title}
							</h2>

							<div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-ink-dim">
								<span>{record.year}</span>
								<span className="h-3 w-px bg-white/15" />
								<span>{record.label}</span>
								<span className="h-3 w-px bg-white/15" />
								<span>{record.genre}</span>
							</div>

							<div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
								<div className="flex items-center gap-2.5">
									<span
										className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-white/25"
										style={{ backgroundColor: record.disc }}
									/>
									<span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
										{record.disc.toLowerCase() === BLACK ? "Black vinyl" : "Coloured vinyl"}
									</span>
								</div>
								<span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint/60">
									press esc
								</span>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Idle hint */}
			<div
				className={`absolute inset-x-0 bottom-7 flex justify-center transition-opacity duration-500 ${
					record ? "opacity-0" : "opacity-100"
				}`}
			>
				<p className="text-[10px] uppercase tracking-[0.26em] text-ink-faint">
					Drag to browse
					<span className="mx-2.5 text-white/15">/</span>
					Click a record to pull it out
				</p>
			</div>

			<footer className="absolute inset-x-0 bottom-0 hidden justify-end p-6 md:flex md:p-8">
				<p className="text-[10px] tracking-wide text-ink-faint/50">three.js · week 1 slice</p>
			</footer>
		</div>
	)
}
