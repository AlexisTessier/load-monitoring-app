import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { NotificationChannelMessagesThreadView } from './notification-channel/notification-channel.messages-thread-view'
import { NotificationChannel } from './notification-channel/notification-channel.model'

import { UptimeChannel } from './uptime-channel/uptime-channel.model'

import { keyStatisticsFrom } from './key-statistics/key-statistics.model'
import { KeyStatisticsTextView } from './key-statistics/key-statistics.text-view'
import { LoadMonitoringGraphView } from './load-monitoring/load-monitoring.graph-view'
import { loadMonitoringFrom } from './load-monitoring/load-monitoring.model'

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
export interface MonitoringPageProps {
  uptimeChannel: UptimeChannel,
  notificationChannel: NotificationChannel
}

export function MonitoringPage({
  uptimeChannel,
  notificationChannel
}: MonitoringPageProps): ReactElement<MonitoringPageProps> {
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
