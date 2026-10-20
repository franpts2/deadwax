import { RECORDS, RECORDS_BY_ID } from "../data/records"
import { useSelection } from "../store/selection"
import { EdgeScrims } from "./EdgeScrims"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { IdleHint } from "./IdleHint"
import { SelectionCard } from "./SelectionCard"

export function Overlay() {
	const selectedId = useSelection((state) => state.selectedId)
	const record = selectedId ? (RECORDS_BY_ID.get(selectedId) ?? null) : null

	return (
		<div className="pointer-events-none fixed inset-0 z-50 select-none">
			<EdgeScrims />
			<Header count={RECORDS.length} />
			<SelectionCard record={record} />
			<IdleHint hidden={record !== null} />
			<Footer />
		</div>
	)
}
