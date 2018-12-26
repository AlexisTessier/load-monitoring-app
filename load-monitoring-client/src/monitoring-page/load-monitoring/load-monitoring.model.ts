import { Timestamp } from '../../definitions'

import { UptimeChannel } from '../uptime-channel/uptime-channel.model'

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

export function loadMonitoringFrom({
	highLoadThreshold,
	uptimeChannel
}: {
	highLoadThreshold: number,
	uptimeChannel: UptimeChannel
}): LoadMonitoring {
	return {
		highLoadThreshold,
		loads: uptimeChannel.updateEvents.map(_ => ({
			utcTime: _.utcTime,
			value: _.averageLoads.lastMinute
		}))
	}
}