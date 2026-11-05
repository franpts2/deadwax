import { isBlackVinyl } from "../data/records"
import type { RecordItem } from "../data/types"

/** Metadata card for the pulled record. All text is real DOM, for screen readers. */
export function SelectionCard({ record }: { record: RecordItem | null }) {
	return (
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
									{isBlackVinyl(record) ? "Black vinyl" : "Coloured vinyl"}
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
	)
}
