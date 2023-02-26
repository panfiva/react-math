import { Fragment } from 'react'
import { AdminContext, AdminUI, defaultTheme, CustomRoutes } from 'react-admin'
import { dataProvider } from './resources/dataProvider'

import { Route } from 'react-router-dom'

import { Apps } from './resources/Apps'
import { Addition } from './resources/Addition'
import { Multiplication } from './resources/Multiplication'

import { i18nProvider } from './lib/messages'
import Layout from './Layout'

import merge from 'lodash/merge'
import { Helmet } from 'react-helmet'

const theme = merge({}, defaultTheme, {
	palette: {
		secondary: {
			light: '#5f5fc4',
			main: '#283593',
			dark: '#001064',
			contrastText: '#fff',
		},
	},
	overrides: {
		MuiFilledInput: {
			root: {
				'backgroundColor': 'rgba(0, 0, 0, 0.04)',
				'&$disabled': {
					backgroundColor: 'rgba(0, 0, 0, 0.04)',
				},
			},
		},
	},
	sidebar: {
		width: 200, // used by react-admin menu sidebar
		closedWidth: 55, // used by react-admin menu sidebar
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: false,
			},
		},
	},
})

const TITLE = 'Math App'

function Resources() {
	return (
		<AdminUI
			layout={Layout}
			dashboard={Apps}
			loginPage={() => null}
			title={TITLE} // error page title
			disableTelemetry
		>
			<CustomRoutes>
				<Route path='/addition/*' element={<Addition />} />
				<Route path='/Multiplication/*' element={<Multiplication />} />
			</CustomRoutes>
		</AdminUI>
	)
}

const BASENAME = ''

const App = () => {
	return (
		<Fragment>
			<Helmet title={TITLE} defer={false}></Helmet>
			<AdminContext
				i18nProvider={i18nProvider}
				theme={theme}
				basename={BASENAME}
				dataProvider={dataProvider}
			>
				<Resources />
			</AdminContext>
		</Fragment>
	)
}

export default App
