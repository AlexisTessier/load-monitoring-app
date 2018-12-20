import React from 'react'

import { MakeLoadChannelService } from './load-channel/service'
import { LoadChannel } from './load-channel/model-view'
import { GraphView } from './load-channel/graph-view'

export interface AppProps {
  name: string
}

export function App(props: AppProps): React.ReactElement<any> {
  const loadChannelEventSource = new EventSource('http://localhost:3002/channel/load')
  const loadChannelService = MakeLoadChannelService(loadChannelEventSource)

  return <LoadChannel View={GraphView} loadChannel={loadChannelService} />
}
