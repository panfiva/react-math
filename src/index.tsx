import { createRoot } from 'react-dom/client'
// import { StrictMode } from 'react'
import { HashRouter } from 'react-router-dom'

import './index.css'
import App from './App'

const container = document.getElementById('root')
if (container) {
	const root = createRoot(container)
	root.render(
		<HashRouter>
			<App />
		</HashRouter>
	)
}
