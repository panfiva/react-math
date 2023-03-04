import { Fragment } from 'react'
import { AdminContext, AdminUI, defaultTheme, CustomRoutes } from 'react-admin'
import { dataProvider } from './resources/dataProvider'

import { Route } from 'react-router-dom'

import { Apps } from './resources/Apps'
import { QuestionPage } from './resources/QuestionPage'

import { i18nProvider } from './lib/messages'
import Layout from './Layout'

import { randomPairFactory2 } from './lib/random'

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

function randomFnFactory() {
	const weights = { 2: 5, 3: 12, 4: 15, 5: 12, 6: 16, 7: 16, 8: 16, 9: 16 }
	return randomPairFactory2({ weights, baseNumbers: [4, 6, 7, 8, 9], perQuestion: 50 })
}

function randomFnFactoryAddition() {
	const weights = { 2: 10, 3: 10, 4: 10, 5: 10, 6: 5, 7: 5, 8: 5, 9: 5 }
	return randomPairFactory2({ weights, baseNumbers: [1, 2, 3], perQuestion: 15 })
}

export const Addition = () => {
	return <QuestionPage operator='+' titleFn='Addition' randomFnFactory={randomFnFactoryAddition} />
}

export const Multiplication = () => {
	return <QuestionPage operator='x' titleFn='Multiplication' randomFnFactory={randomFnFactory} />
}

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
