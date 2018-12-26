import {
  green,
  orange,
  red
} from '../../../settings/colors'

test('green', () => {
  expect(typeof green).toBe('string')
})

test('orange', () => {
  expect(typeof orange).toBe('string')
})

test('red', () => {
  expect(typeof red).toBe('string')
})

test('snapshot', () => {
  expect({
    green,
    orange,
    red
  }).toMatchSnapshot()
})
