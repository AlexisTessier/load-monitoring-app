import { UptimeChannel } from '../uptime-channel/uptime-channel.model'

export interface KeyStatistics {
  uptime: string
}

export function keyStatisticsFrom({
	uptimeChannel
}: {
	uptimeChannel: UptimeChannel
}): KeyStatistics{
	const updates = uptimeChannel.updateEvents
	const updatesCount = updates.length
	return {
		uptime: updatesCount > 0 ? updates[updatesCount-1].stdout : ''
	}
}