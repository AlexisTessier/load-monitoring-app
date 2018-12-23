import React, { Fragment } from 'react'
import { createGlobalStyle } from 'styled-components' 
import reset from 'styled-reset'

import { sseOrigin } from './settings/api'
import { MonitoringPage } from './monitoring-page/monitoring-page.component'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

const uptimeChannelOrigin = `${sseOrigin}/uptime`
const uptimeChannelEventSource = new EventSource(uptimeChannelOrigin)

export function App(): React.ReactElement<any> {
  return <Fragment>
    <GlobalStyle />
    <MonitoringPage uptimeChannelEventSource={uptimeChannelEventSource}/>
  </Fragment>
}
