import { Fragment } from 'react'
import { AdminContext, AdminUI, defaultTheme, CustomRoutes } from 'react-admin'
import { dataProvider } from './resources/dataProvider'

import { Route } from 'react-router-dom'

import { Apps } from './resources/Apps'

import { SelectBaseQuestionPage } from './resources/SelectBase'

import { i18nProvider } from './lib/messages'
import Layout from './Layout'

import { shuffle } from './lib/random'

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

const multiplicationWeights = { 2: 5, 3: 10, 4: 15, 5: 7, 6: 15, 7: 15, 8: 15, 9: 15 }
const additionWeights = { 1: 5, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10 }

export const Addition = () => {
	return (
		<SelectBaseQuestionPage
			operator='+'
			title='Addition'
			perQuestion={50}
			weights={additionWeights}
			starting_base={shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 3)}
		/>
	)
}

export const Multiplication = () => {
	return (
		<SelectBaseQuestionPage
			operator='x'
			title='Multiplication'
			perQuestion={50}
			weights={multiplicationWeights}
			starting_base={shuffle([4, 6, 7, 8, 9]).slice(0, 3)}
		/>
	)
}

const LoginPage = () => null

function Resources() {
	return (
		<AdminUI
			layout={Layout}
			dashboard={Apps}
			loginPage={LoginPage}
			title={TITLE} // error page title
			disableTelemetry
		>
			<CustomRoutes>
				<Route path='/addition/*' element={<Addition />} />
				<Route path='/multiplication/*' element={<Multiplication />} />
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
