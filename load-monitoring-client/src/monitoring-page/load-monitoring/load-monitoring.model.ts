import { Timestamp } from '../../definitions'

export type LoadValue = number

export interface Load {
	utcTime: Timestamp,
	value: LoadValue
}

export interface LoadMonitoring {
	loads: Load[],
	highLoadThreshold: LoadValue
}

export const getLoadUtcTime = (_: Load) => _.utcTime
export const getLoadValue = (_: Load) => _.value