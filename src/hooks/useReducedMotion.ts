import { useMemo } from "react"

export function useReducedMotion(): boolean {
	return useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, [])
}
