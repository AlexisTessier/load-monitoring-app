import React, { ReactElement } from 'react'

export interface AppProps {
  name: string
}

export function App(props: AppProps): ReactElement<AppProps> {
  return <h1>Hello world !!!</h1>
}
