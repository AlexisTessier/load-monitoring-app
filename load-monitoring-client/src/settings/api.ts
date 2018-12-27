export const protocol = 'http'
export const host = 'localhost'

export const port = process.env.REACT_APP_API_PORT

export const apiOrigin = `${protocol}://${host}:${port}`

export const sseOrigin = `${apiOrigin}/channel`
