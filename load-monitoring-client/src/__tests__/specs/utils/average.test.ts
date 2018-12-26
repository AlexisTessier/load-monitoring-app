import { average } from '../../../utils/average'

describe('average', () => {
  test('should handle array of 2 numbers', () => {
    expect(average([3, 2])).toBe(2.5)
  })

  test('should handle array of 1 number', () => {
    expect(average([6])).toBe(6)
  })

  test('should handle array of x numbers', () => {
    expect(average([2, 5, 8, 9, 12])).toBe(7.2)
  })

  test('should handle an empty array', () => {
    expect(average([])).toBe(0)
  })
})
