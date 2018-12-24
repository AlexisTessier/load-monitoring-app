export interface NotificationChannelEvent {
	utcTime: number,
	type: 'alert' | 'recovery',
	averageLoad: number
}

export const getEventUtcTime =
	(_: NotificationChannelEvent) => _.utcTime

export const getEventAverageLoad =
	(_: NotificationChannelEvent) => _.averageLoad

export interface NotificationChannel {
	notifyEvents: NotificationChannelEvent[]
}

export function tryCreateNotificationChannelEvent(raw: NotificationChannelEvent): NotificationChannelEvent {
	const error = (reason: string) => new Error(
		`Failed to create a NotificationChannelEvent from raw value. ${reason}`
	)

	if(typeof raw !== 'object'){
		throw error(`raw is not an object (${raw})`)
	}

	if(typeof raw.utcTime !== 'number'){
		throw error(`raw.utcTime is not a string (${raw.utcTime})`)
	}

	if(['alert', 'recovery'].indexOf(raw.type) < 0){
		throw error(`raw.type is not one of ['alert', 'recovery'] (${raw.type})`)
	}

	if(typeof raw.averageLoad !== 'number'){
		throw error(`raw.averageLoad is not a number (${raw.averageLoad})`)
	}
	return {
		utcTime: raw.utcTime,
		type: raw.type,
		averageLoad: raw.averageLoad
	}
}