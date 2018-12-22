import React from 'react'
import styled from 'styled-components'

import { VictoryTheme, VictoryChart, VictoryArea, VictoryLegend, VictoryScatter } from 'victory'

import { ViewComponent, ViewElement } from '../mvc'
import { LoadChannel, LoadChannelEvent, Load } from './model'

import { Duration, Timestamp, minute } from '../constants/time'
import { green, red, orange } from '../settings/colors'
import { average } from '../utils/average'

const Container = styled.div`
  margin: 0 auto;
  padding:0;
  width: 92%;
  height: 100vh;
`

export const lowLoadColor = green
export const highLoadColor = orange
export const warningColor = red
export const warningThreshold = 1

function areaStyle(events: LoadChannelEvent[]){
  const now = Date.now()
  const newerThan2Minutes = (timestamp: Timestamp) => (
    now - timestamp <= 2 * minute
  )

  const warning = average(events
    .filter(event => newerThan2Minutes(event.timestamp))
    .map(event => event.load)
  ) > warningThreshold

  return {
    data: {
      fill: warning ? warningColor : lowLoadColor
    }
  }
}

const scatterStyle = {
  data: {
    fill: ({y: load}: {y: Load}) => load > warningThreshold ? highLoadColor : 'transparent'
  }
}

interface Position { x: number, y: number }

function toData(events: LoadChannelEvent[]): Position[] {
  return events.map(({timestamp: x, load: y}) => ({x, y}))
}

function LoadPoint(){
  return <h1>l</h1>
}

export function GraphView({
  events
}: LoadChannel): ViewElement {
  const data = toData(events)
  return <Container> 
    <VictoryChart
      width={800}
      theme={VictoryTheme.material}
    >
      <VictoryLegend
        x={50} y={20}
        orientation='horizontal'
        data={[
          { name: 'Low average load', symbol: {type: 'square', fill: lowLoadColor}},
          { name: 'High average load', symbol: {type: 'square', fill: warningColor}},
          { name: 'High load', symbol: {type: 'circle', fill: highLoadColor}}
        ]}
      />
      <VictoryArea
        style={areaStyle(events)}
        data={data}
      />
      <VictoryScatter
        style={scatterStyle as any}
        data={data}
      />
    </VictoryChart>
  </Container>
}