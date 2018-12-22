export function sumReducer(a: number, b: number): number {
  return a + b
}

export function sum(numbers: number[]): number {
	return numbers.reduce(sumReducer, 0)
}