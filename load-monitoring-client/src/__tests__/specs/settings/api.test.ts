import {
  apiOrigin,
  host,
  port,
  protocol,
  sseOrigin
} from '../../../settings/api'

test('protocol', () => {
  expect(typeof protocol).toBe('string')
})

test('host', () => {
  expect(typeof host).toBe('string')
})

test('port', () => {
  expect(typeof port).toBe('string')
})

test('apiOrigin', () => {
  expect(typeof apiOrigin).toBe('string')
})

test('sseOrigin', () => {
  expect(typeof sseOrigin).toBe('string')
})

test('snapshot', () => {
  expect({
    protocol,
    host,
    port,
    apiOrigin,
    sseOrigin
  }).toMatchSnapshot()
})
