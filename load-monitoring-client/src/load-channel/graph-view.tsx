import React from 'react'
import styled from 'styled-components'

import { locales } from '../settings/time'

import {
  VictoryTheme,
  VictoryChart,
  VictoryArea,
  VictoryLegend,
  VictoryLine,
  VictoryAxis,
  VictoryStyleInterface,
  DomainPropType
} from 'victory'

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

export const lowAverageLoadColor = green
export const highAverageLoadColor = red
export const highLoadThresholdColor = orange
export const highLoadThreshold = 1

function areaStyle(events: LoadChannelEvent[]): VictoryStyleInterface {
  const now = Date.now()
  const newerThan2Minutes = (timestamp: Timestamp) => (
    now - timestamp <= 2 * minute
  )

  const highAverageLoad = average(events
    .filter(event => newerThan2Minutes(event.timestamp))
    .map(event => event.load)
  ) > highLoadThreshold

  return {
    data: {
      fill: highAverageLoad ? highAverageLoadColor : lowAverageLoadColor
    }
  }
}

function thresholdLineStyle(events: LoadChannelEvent[]): VictoryStyleInterface {
  return {
    data: {
      stroke: highLoadThresholdColor
    }
  }
}

interface GraphDataItem { x: number, y: number }

function toData(events: LoadChannelEvent[]): GraphDataItem[] {
  return events.map(({timestamp: x, load: y}) => ({x, y}))
}

function tickFormatedDate(date: Date): string {
  return date.toLocaleTimeString(locales)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function GraphView({
  events
}: LoadChannel): ViewElement {
  const loadData = toData(events)
  const thresholdData = loadData.map(({x}) => ({
    x, y: highLoadThreshold
  }))
  const timestamps = events.map(_ => _.timestamp)
  const dataDomain = {
    x: [Math.min(...timestamps), Math.max(...timestamps)],
    y: [0, 0.1+Math.max(highLoadThreshold, ...events.map(_ => _.load))]
  }

  return <Container> 
    <VictoryChart
      width={800}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
        tickCount={10}
        tickFormat={(x) => tickFormatedDate(new Date(x))}
        style={{
          tickLabels: {
            fontSize: 10
          }
        }}
     />
      <VictoryAxis
        dependentAxis={true}
        label='Last minute average load'
        fixLabelOverlap={true}
        style={{
          tickLabels: {
            marginRight: 20
          }
        }}
      />
      <VictoryLegend
        x={50} y={20}
        orientation='horizontal'
        data={[
          { name: 'Low average load', symbol: {type: 'square', fill: lowAverageLoadColor}},
          { name: 'High average load', symbol: {type: 'square', fill: highAverageLoadColor}},
          { name: 'High load threshold', symbol: {type: 'minus', fill: highLoadThresholdColor}}
        ]}
      />
      <VictoryArea
        style={areaStyle(events)}
        domain={dataDomain as DomainPropType}
        data={loadData}
      />
      <VictoryLine
        style={thresholdLineStyle(events)}
        domain={dataDomain as DomainPropType}
        data={thresholdData}
      />
    </VictoryChart>
  </Container>
}