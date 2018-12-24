import React from 'react'
import styled from 'styled-components'

import { createUptimeChannelStore } from './uptime-channel/uptime-channel.store'

import { KeyStatisticsController } from './key-statistics/key-statistics.controller'
import { TextView } from './key-statistics/key-statistics.text-view'
import { createKeyStatisticsStore } from './key-statistics/key-statistics.store'

import { LoadMonitoringController } from './load-monitoring/load-monitoring.controller'
import { GraphView } from './load-monitoring/load-monitoring.graph-view'
import { createLoadMonitoringStore } from './load-monitoring/load-monitoring.store'

import { NotificationChannelController } from './notification-channel/notification-channel.controller'
import { createNotificationChannelStore } from './notification-channel/notification-channel.store'
import { ToasterView } from './notification-channel/notification-channel.toaster-view'

const Container = styled.div`
  margin: 20px auto;
  padding:0;
  width: 92%;
  height: 90vh;
  display: flex;
`

const Left = styled.div`
  width: 72%;
`

const Right = styled.div`
  width: 26%;
  margin-left: 2%;
`

export function MonitoringPage({
	uptimeChannelEventSource,
	notificationChannelEventSource
}: {
	uptimeChannelEventSource: EventSource,
	notificationChannelEventSource: EventSource
}){
	const uptimeChannelStore = createUptimeChannelStore({
		eventSource: uptimeChannelEventSource
	})

	const notificationChannelStore = createNotificationChannelStore({
		eventSource: notificationChannelEventSource
	})

	const keyStatistics = createKeyStatisticsStore({
		uptimeChannelStore
	})

	const loadMonitoring = createLoadMonitoringStore({
		uptimeChannelStore,
		highLoadThreshold: 1
	})

	return <Container>
		<Left>
			<KeyStatisticsController View={TextView} store={keyStatistics}/>
			<LoadMonitoringController View={GraphView} store={loadMonitoring}/>
		</Left>
		<Right>
			<NotificationChannelController View={ToasterView} store={notificationChannelStore}/>
		</Right>
	</Container>
}