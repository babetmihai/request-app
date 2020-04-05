import qs from 'qs'
import isEmpty from 'lodash/isEmpty'

const delay = (time) => new Promise(resolve => setTimeout(resolve, time))
export default async (url, { timeout = 30000, query = {}, ...options } = {}) => {
  const filteredQuery = Object.keys(query)
    .reduce((acc, key) => {
      const value = query[key]
      if (value === undefined || value === '') return acc
      acc[key] = value
      return acc
    }, {})

  const queryString = isEmpty(filteredQuery)
    ? ''
    : `?${qs.stringify(filteredQuery)}`

  const res = await Promise.race([
    fetch(`${url}${queryString}`, options),
    delay(timeout).then(() => {
      throw new Error('request.timeout')
    })
  ])

  if (res.ok) return res

  let body = {}
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    body = await res.json()
  } else {
    body = await res.text()
  }

  const { message = res.statusText } = body
  const error = new Error(message)
  error.status = res.status
  error.body = body
  throw error
}