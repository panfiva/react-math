import polyglotI18nProvider from 'ra-i18n-polyglot'
import englishMessages from 'ra-language-english'

const customMessages = {}

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
