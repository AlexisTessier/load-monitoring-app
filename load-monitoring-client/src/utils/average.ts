import { sum } from './sum'

export function average(numbers: number[]): number {
  const count = numbers.length
  return count === 0 ? 0 : sum(numbers) / count
}
