import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import * as serviceWorker from './serviceWorker'

import { sseOrigin } from './settings/api'

import { createNotificationChannelStore } from './monitoring-page/notification-channel/notification-channel.store'
import { createUptimeChannelStore } from './monitoring-page/uptime-channel/uptime-channel.store'

const uptimeChannelStore = createUptimeChannelStore({
  eventSource: new EventSource(`${sseOrigin}/uptime`),
  getDateNow: () => Date.now()
})

const notificationChannelStore = createNotificationChannelStore({
  eventSource: new EventSource(`${sseOrigin}/notification`)
})

ReactDOM.render(
  <App {...{
    uptimeChannelStore,
    notificationChannelStore
  }}/>,
  document.getElementById('root')
)

serviceWorker.register()
