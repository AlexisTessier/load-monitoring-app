import React from 'react'

import { LoadMonitoringController } from './load-monitoring/load-monitoring.controller'
import { GraphView } from './load-monitoring/load-monitoring.graph-view'
import { createLoadMonitoringStore } from './load-monitoring/load-monitoring.store'

import { createUptimeChannelStore } from './uptime-channel/uptime-channel.store'

export function MonitoringPage({
	uptimeChannelEventSource
}: {
	uptimeChannelEventSource: EventSource
}){
	const uptimeChannelStore = createUptimeChannelStore({
		eventSource: uptimeChannelEventSource
	})

	const loadMonitoring = createLoadMonitoringStore({
		uptimeChannelStore,
		highLoadThreshold: 1
	})

	return <LoadMonitoringController View={GraphView} store={loadMonitoring}/>
}