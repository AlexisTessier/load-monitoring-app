import React from 'react'
import styled from 'styled-components'

import {
  VictoryTheme,
  VictoryChart,
  VictoryArea,
  VictoryLegend,
  VictoryLine,
  VictoryAxis,
  VictoryStyleInterface,
  DomainPropType,
  VictoryLabel
} from 'victory'

import { ViewComponent, ViewElement } from '../../mvc'
import { Timestamp } from '../../definitions'
import { minute } from '../../constants/durations'
import { green, red, orange } from '../../settings/colors'
import { average } from '../../utils/average'

import { LoadMonitoring, Load, getLoadUtcTime, getLoadValue } from './load-monitoring.model'

const Container = styled.div`
  margin: 0 auto;
  padding:0;
  width: 92%;
  height: 100vh;
`

export const lowAverageLoadColor = green
export const highAverageLoadColor = red
export const highLoadThresholdColor = orange

function loadsAreaStyle(_: {
  highAverageLoad: boolean
}): VictoryStyleInterface {
  return {
    data: {
      fill: _.highAverageLoad ? highAverageLoadColor : lowAverageLoadColor
    }
  }
}

const highLoadThresholdLineStyle: VictoryStyleInterface = {
  data: {
    stroke: highLoadThresholdColor
  }
}

const fontSize = 10

const axisStyle = {
  axisLabel: {
    fontSize
  },
  tickLabels: {
    fontSize
  }
}

export function GraphView({
  loads,
  highLoadThreshold
}: LoadMonitoring): ViewElement {
  if(loads.length === 0){
    return <Container>Loading data...</Container>
  }

  const now = Date.now()
  const getHighLoadThreshold = () => highLoadThreshold
  const loadAxisPadding = 0.05

  const xAxisValues = loads.map(getLoadUtcTime)
  const dataDomain: DomainPropType = {
    x: [Math.min(...xAxisValues), Math.max(...xAxisValues)],
    y: [0, loadAxisPadding + Math.max(highLoadThreshold, ...loads.map(getLoadValue))]
  }

  const newerThan2Minutes = (timestamp: Timestamp) => (
    now - timestamp <= 2 * minute
  )

  const highAverageLoad = average(loads
    .filter(_ => newerThan2Minutes(_.utcTime))
    .map(getLoadValue)
  ) > highLoadThreshold

  const timezoneOffset = new Date().getTimezoneOffset() * minute
  const formatLoadUtcTime = (x: Timestamp) => new Date(x + timezoneOffset).toLocaleTimeString()

  return <Container>
    <VictoryChart
      width={800}
      theme={VictoryTheme.material}
      domain={dataDomain}
    >
      <VictoryLegend
        x={50} y={20}
        orientation='horizontal'
        data={[
          { name: 'Low average load', symbol: {type: 'square', fill: lowAverageLoadColor}},
          { name: 'High average load', symbol: {type: 'square', fill: highAverageLoadColor}},
          { name: 'High load threshold', symbol: {type: 'minus', fill: highLoadThresholdColor}}
        ]}
      />
      <VictoryAxis
        label='UTC Time'
        axisLabelComponent={<VictoryLabel y={340}/>}
        tickCount={10}
        tickFormat={formatLoadUtcTime}
        style={axisStyle}
     />
      <VictoryAxis
        dependentAxis={true}
        label='Average load'
        axisLabelComponent={<VictoryLabel x={10}/>}
        style={axisStyle}
      />
      <VictoryArea
        style={loadsAreaStyle({highAverageLoad})}
        data={loads}
        x={getLoadUtcTime}
        y={getLoadValue}
      />
      <VictoryLine
        style={highLoadThresholdLineStyle}
        data={loads}
        x={getLoadUtcTime}
        y={getHighLoadThreshold}
      />
    </VictoryChart>
  </Container>
}