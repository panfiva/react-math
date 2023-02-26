import { DataProvider } from 'react-admin'

export const dataProvider: DataProvider = {
	// can be used to trigger refresh
	getCurrentDate: async () => {
		const dt = Date.now()
		return dt
	},
} as any

