/**
 * Removes trailing slash (if present) and adds leading slash (if missing)
 */
export const trimPath = (path: string) => {
	if (!path) return ''

	return ('/' + path).replace(/^[/]+/g, '/').replace(/[/]+$/, '')
}
