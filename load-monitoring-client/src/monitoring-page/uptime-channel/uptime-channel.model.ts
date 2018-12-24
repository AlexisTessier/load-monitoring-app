export interface UptimeChannelUpdateEvent {
	stdout: string,
	utcTime: number,
	averageLoads: {
		lastMinute: number,
		last5Minutes: number,
		last15Minutes: number
	}
}

export const getUpdateEventStdout =
	(_: UptimeChannelUpdateEvent) => _.stdout

export const getUpdateEventUtcTime =
	(_: UptimeChannelUpdateEvent) => _.utcTime

export const getUpdateEventLastMinuteAverageLoad =
	(_: UptimeChannelUpdateEvent) => _.averageLoads.lastMinute

export interface UptimeChannel {
	updateEvents: UptimeChannelUpdateEvent[]
}

export function tryCreateUptimeChannelUpdateEvent(raw: UptimeChannelUpdateEvent): UptimeChannelUpdateEvent {
	const error = (reason: string) => new Error(
		`Failed to create a UptimeChannelUpdateEvent from raw value. ${reason}`
	)

	if(typeof raw !== 'object'){
		throw error(`raw is not an object (${raw})`)
	}

	if(typeof raw.stdout !== 'string'){
		throw error(`raw.stdout is not a string (${raw.stdout})`)
	}

	if(typeof raw.utcTime !== 'number'){
		throw error(`raw.utcTime is not a number (${raw.utcTime})`)
	}

	const averageLoads = raw.averageLoads

	if(typeof averageLoads !== 'object'){
		throw error(`raw.averageLoads is not a number (${averageLoads})`)
	}

	if(typeof averageLoads.lastMinute !== 'number'){
		throw error(`raw.averageLoads.lastMinute is not a number (${averageLoads.lastMinute})`)
	}

	if(typeof averageLoads.last5Minutes !== 'number'){
		throw error(`raw.averageLoads.last5Minutes is not a number (${averageLoads.last5Minutes})`)
	}

	if(typeof averageLoads.last15Minutes !== 'number'){
		throw error(`raw.averageLoads.last15Minutes is not a number (${averageLoads.last15Minutes})`)
	}

	return {
		stdout: raw.stdout,
		utcTime: raw.utcTime,
		averageLoads: {
			lastMinute: averageLoads.lastMinute,
			last5Minutes: averageLoads.last5Minutes,
			last15Minutes: averageLoads.last15Minutes
		}
	}
}