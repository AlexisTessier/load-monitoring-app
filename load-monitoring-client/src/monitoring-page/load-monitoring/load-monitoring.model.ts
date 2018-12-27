import { minute } from '../../constants/durations'
import { DateNowGetter, Timestamp } from '../../definitions'

import { average } from '../../utils/average'

import { UptimeChannel } from '../uptime-channel/uptime-channel.model'

export type LoadValue = number

export interface Load {
  utcTime: Timestamp,
  value: LoadValue
}

export const getLoadUtcTime = (_: Load) => _.utcTime
export const getLoadValue = (_: Load) => _.value

export interface LoadMonitoring {
  loads: Load[],
  highLoadThreshold: LoadValue
}

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

export function isRecentAverageLoadHigh({
  loads,
  highLoadThreshold
}: LoadMonitoring, getDateNow: DateNowGetter): boolean {
  const now = getDateNow()

  const newerThan2Minutes = (timestamp: Timestamp) => (
    now - timestamp <= 2 * minute
  )

  return average(loads
    .filter(_ => newerThan2Minutes(_.utcTime))
    .map(getLoadValue)
  ) > highLoadThreshold
}
