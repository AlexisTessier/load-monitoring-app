import React from 'react'
import styled from 'styled-components'

import { VictoryTheme, VictoryChart, VictoryArea } from 'victory'

import { ViewComponent, ViewElement } from '../mvc'
import { LoadChannel, LoadChannelEvent } from './model'

const Container = styled.div`
  margin: 0 auto;
  padding:0;
  width: 100%;
  height: 100vh;
`

const areaStyle = {
  data: {
    fill: "#38a1e5"
  }
}

interface Position { x: number, y: number }

function toData(events: LoadChannelEvent[]): Position[] {
  return events.map(({timestamp: x, load: y}) => ({x, y}))
}

export function GraphView({
  events
}: LoadChannel): ViewElement {
  return <Container> 
    <VictoryChart width={800} theme={VictoryTheme.material}>
      <VictoryArea
        style={areaStyle}
        data={toData(events)}
      />
    </VictoryChart>
  </Container>
}