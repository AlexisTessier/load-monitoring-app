import { sum, sumReducer } from '../../../utils/sum'

describe('sumReducer', () => {
  test('should add two number', () => {
    expect(sumReducer(1, 2)).toBe(3)
    expect(sumReducer(5, 3)).toBe(8)
  })
})

describe('sum', () => {
  test('should sum array of 2 numbers', () => {
    expect(sum([3, 2])).toBe(5)
    expect(sum([5, 4])).toBe(9)
  })

  test('should sum array of x numbers', () => {
    expect(sum([3, 2, 5, 8, 1])).toBe(19)
  })

  test('should sum array of 1 number', () => {
    expect(sum([3])).toBe(3)
  })

  test('should empty array', () => {
    expect(sum([])).toBe(0)
  })
})
