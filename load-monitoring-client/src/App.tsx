import React from 'react'

import { LoadChannel, TextView } from './models-views/LoadChannel'

export interface AppProps {
  name: string
}

export function App(props: AppProps): React.ReactElement<AppProps> {
  return <LoadChannel View={TextView}
  	nameSource="input"
  />
}
