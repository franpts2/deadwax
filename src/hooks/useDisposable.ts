import { type DependencyList, useEffect, useMemo } from "react"

type Disposable = { dispose(): void }

/**
 * Create an imperative three.js object and dispose it when the value is
 * replaced or the component unmounts.
 *
 * Never wrap a *cached* texture in this: the cache owns it, not the component.
 */
export function useDisposable<T extends Disposable>(factory: () => T, deps: DependencyList): T {
	const value = useMemo(factory, deps)
	useEffect(() => () => value.dispose(), [value])
	return value
}

/** `useDisposable` for factories that only produce something when needed. */
export function useOptionalDisposable<T extends Disposable>(
	factory: () => T | null,
	deps: DependencyList,
): T | null {
	const value = useMemo(factory, deps)
	useEffect(() => () => value?.dispose(), [value])
	return value
}
