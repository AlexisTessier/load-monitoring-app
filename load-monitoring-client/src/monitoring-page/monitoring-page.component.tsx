import React from 'react'
import styled from 'styled-components'

import { NotificationChannel } from './notification-channel/notification-channel.model'
import { NotificationChannelMessagesThreadView } from './notification-channel/notification-channel.messages-thread-view'

import { UptimeChannel } from './uptime-channel/uptime-channel.model'

import { keyStatisticsFrom } from './key-statistics/key-statistics.model'
import { KeyStatisticsTextView } from './key-statistics/key-statistics.text-view'
import { loadMonitoringFrom } from './load-monitoring/load-monitoring.model'
import { LoadMonitoringGraphView } from './load-monitoring/load-monitoring.graph-view'

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
	uptimeChannel,
	notificationChannel
}: {
	uptimeChannel: UptimeChannel,
	notificationChannel: NotificationChannel
}){
	const keyStatistics = keyStatisticsFrom({
		uptimeChannel
	})
	const loadMonitoring = loadMonitoringFrom({
		highLoadThreshold: 1,
		uptimeChannel
	})

	return <Container>
		<Left>
			<KeyStatisticsTextView {...keyStatistics}/>
			<LoadMonitoringGraphView {...loadMonitoring}/>
		</Left>
		<Right>
			<NotificationChannelMessagesThreadView {...notificationChannel}/>
		</Right>
	</Container>
}