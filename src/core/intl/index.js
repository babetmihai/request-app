import capitalize from 'lodash/capitalize'
import { createStoreApi } from 'store'
import moment from 'moment'

const MODULE_NAME = 'intl'
const LOCALE_LIST = ['ro', 'en']
const store = createStoreApi(MODULE_NAME)

export const initLocale = async () => {
  let locale = navigator.language.substr(0, 2)
  if (!LOCALE_LIST.includes(locale)) locale = LOCALE_LIST[0]
  if (locale !== 'en') await import(`moment/locale/${locale}`)

  moment.locale(locale)
  const { default: messages } = await import(`./messages/${locale}.json`)
  await store.set({ locale, messages })
}

const formatId = (id) => {
  return capitalize(id.split('.').join(' '))
}

export const t = (id) => {
  if (!id) return ''
  const messages = store.get('messages', {})
  return messages[id] || formatId(id) || ''
}

export default store