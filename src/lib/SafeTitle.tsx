import { useState, useRef, useEffect, useCallback } from 'react'
import { Title, TitleProps } from 'react-admin'

/**
 * this component is needed until issue https://github.com/marmelab/react-admin/issues/7745#issuecomment-1171891980 is addressed
 */
export const SafeTitle = (props: TitleProps) => {
	const [ready, setReady] = useSafeSetState(false)

	const container = (document && document.getElementById('react-admin-title')) || null

	useEffect(() => {
		const tgt = (document && document.getElementById('react-admin-title')) || null

		if (tgt) {
			setReady(true)
			return
		}

		const timer = setTimeout(() => {
			setReady(true)
		}, 500)

		return () => {
			clearTimeout(timer)
		}
	}, [setReady])

	if (!ready && !container) return null
	else return <Title {...props} />
}

function useSafeSetState<T>(
	initialState?: T | (() => T)
): [T | undefined, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = useState(initialState)

	const mountedRef = useRef(false)
	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])
	const safeSetState = useCallback(
		(args: any) => {
			if (mountedRef.current) {
				return setState(args)
			}
		},
		[mountedRef, setState]
	)

	return [state, safeSetState]
}

