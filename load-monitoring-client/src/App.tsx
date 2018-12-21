import React, { Fragment } from 'react'
import { createGlobalStyle } from 'styled-components' 
import reset from 'styled-reset'

import { createLoadChannelStore } from './load-channel/store'
import { LoadChannelController } from './load-channel/controller'
import { GraphView } from './load-channel/graph-view'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

export interface AppProps {
  name: string
}

export function App(props: AppProps): React.ReactElement<any> {
  const loadChannelEventSource = new EventSource('http://localhost:3002/channel/load')
  const loadChannel = createLoadChannelStore(loadChannelEventSource)

  return <Fragment>
    <GlobalStyle />
    <LoadChannelController View={GraphView} store={loadChannel}/>
  </Fragment>
}
