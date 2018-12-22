import { Timestamp } from '../constants/time'

export type Load = number

export interface LoadChannelEvent {
	timestamp: Timestamp,
	load: Load
}

export interface LoadChannel {
	events: LoadChannelEvent[]
}

export function tryCreateLoadChannelEvent(raw: LoadChannelEvent): LoadChannelEvent {
	const error = (reason: string) => new Error(
		`Failed to create a LoadChannelEvent from raw value. ${reason}`
	)

	if(typeof raw !== 'object'){
		throw error(`raw is not an object (${raw})`)
	}

	if(typeof raw.timestamp !== 'number'){
		throw error(`raw.timestamp is not a number (${raw.timestamp})`)
	}

	if(typeof raw.load !== 'number'){
		throw error(`raw.load is not a number (${raw.load})`)
	}

	return {
		timestamp: raw.timestamp,
		load: raw.load
	}
}