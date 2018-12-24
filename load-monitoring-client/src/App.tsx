import React, { Fragment } from 'react'
import { createGlobalStyle } from 'styled-components' 
import reset from 'styled-reset'

import { sseOrigin } from './settings/api'
import { MonitoringPage } from './monitoring-page/monitoring-page.component'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

const uptimeChannelEventSource = new EventSource(`${sseOrigin}/uptime`)
const notificationChannelEventSource = new EventSource(`${sseOrigin}/notification`)

export function App(): React.ReactElement<any> {
  return <Fragment>
    <GlobalStyle />
    <MonitoringPage
    	uptimeChannelEventSource={uptimeChannelEventSource}
    	notificationChannelEventSource={notificationChannelEventSource}
    />
  </Fragment>
}
