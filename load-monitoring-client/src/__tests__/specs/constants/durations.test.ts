import {
  day,
  hour,
  millisecond,
  minute,
  second,
  week
} from '../../../constants/durations'

test('millisecond', () => {
  expect(millisecond).toBe(1)
})

test('second', () => {
  expect(second).toBe(1000)
})

test('minute', () => {
  expect(minute).toBe(60000)
})

test('hour', () => {
  expect(hour).toBe(3600000)
})

test('day', () => {
  expect(day).toBe(86400000)
})

test('week', () => {
  expect(week).toBe(604800000)
})
