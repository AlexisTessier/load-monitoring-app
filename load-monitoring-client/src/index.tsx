import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import * as serviceWorker from './serviceWorker'

import { sseOrigin } from './settings/api'

import { createUptimeChannelStore } from './monitoring-page/uptime-channel/uptime-channel.store'
import { createNotificationChannelStore } from './monitoring-page/notification-channel/notification-channel.store'

const uptimeChannelStore = createUptimeChannelStore({
	eventSource: new EventSource(`${sseOrigin}/uptime`)
})

const notificationChannelStore = createNotificationChannelStore({
	eventSource: new EventSource(`${sseOrigin}/notification`)
})

const app = {
	uptimeChannelStore,
	notificationChannelStore
}

ReactDOM.render(
	<App {...app}/>,
	document.getElementById('root')
)

serviceWorker.register()
