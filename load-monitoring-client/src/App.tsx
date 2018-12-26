import React, { Fragment, useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

import { MonitoringPage } from './monitoring-page/monitoring-page.container'

import { NotificationChannelStore } from './monitoring-page/notification-channel/notification-channel.store'
import { UptimeChannelStore } from './monitoring-page/uptime-channel/uptime-channel.store'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

export function App({
  uptimeChannelStore,
  notificationChannelStore
}: {
  uptimeChannelStore: UptimeChannelStore,
  notificationChannelStore: NotificationChannelStore
}): React.ReactElement<any> {
  const [uptimeChannel, setUptimeChannel] = useState(uptimeChannelStore.model)
  useEffect(() => {
    uptimeChannelStore.source.once('update', () => {
      setUptimeChannel(uptimeChannelStore.model)
    })
  })

  const [notificationChannel, setNotificationChannel] = useState(notificationChannelStore.model)
  useEffect(() => {
    notificationChannelStore.source.once('update', () => {
      setNotificationChannel(notificationChannelStore.model)
    })
  })

  return <Fragment>
    <GlobalStyle />
    <MonitoringPage
      uptimeChannel={uptimeChannel}
      notificationChannel={notificationChannel}
    />
  </Fragment>
}
