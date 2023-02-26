import polyglotI18nProvider from 'ra-i18n-polyglot'
import englishMessages from 'ra-language-english'

// zzz fixMe: search for all portal.xxx.yyy messages in web and server component, and remove unused ones
const customMessages = {
	portal: {
		app: {
			start: 'Application Start',
			onClick: 'onClick event', // include label and cb props
			invalidResource: 'Invalid resource',
			configError: 'Configuration error; Please contact support.',
			error: 'An error occurred processing request',
			ie: 'Internet Explorer is not supported due to UI bugs. For best experience, please use Google Chrome',
			requestFailed: 'Request failed',
			duplicate: 'Record already exists',
			contactSupport: 'An error occurred processing request',
			cannotConnect: 'Cannot connect to REST server',
		},
		auth: {
			authRequired: 'Authentication required',
			cannotConnectBackend: 'Cannot read user roles: Cannot connect to backend',
			accessDenied: 'Access denied',
			failed: 'Authentication failed',
			fetchedAccessToken: 'Received new access token',
		},
		required_role: {
			admin: 'Access is only granted to Solution Engineering DevOPS team',
		},
		okta: {
			expired: 'Token expired',
			renewed: 'Token has been renewed',
		},
		report: {
			mount: 'Mounted report component',
			cancel: 'Cancelling load request',
			emptyProperty: "Missing or empty configuration parameter '%{emptyPropertyPath'}",
			missingScopesScopes: "Missing 'securityScopes' attribute",
		},
	},
}

englishMessages.ra.notification.item_doesnt_exist = 'Record not found'

const messages: any = {
	en: { ...englishMessages, ...customMessages },
}

//override name of Home page
messages.en.ra.page.dashboard = 'Home'

// /** @see https://marmelab.com/react-admin/Translation.html#silencing-translation-warnings */
export const i18nProvider = polyglotI18nProvider((locale) => messages[locale], 'en', {
	allowMissing: true,
})
