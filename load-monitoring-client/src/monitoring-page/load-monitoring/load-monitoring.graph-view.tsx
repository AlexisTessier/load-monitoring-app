import React, { Fragment, ReactElement } from 'react'

import {
  DomainPropType,
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryStyleInterface,
  VictoryTheme
} from 'victory'

import { minute } from '../../constants/durations'
import { Timestamp } from '../../definitions'
import { green, orange, red } from '../../settings/colors'

import { LoadingData } from '../../components/loading-data'

import { getLoadUtcTime, getLoadValue, isRecentAverageLoadHigh, LoadMonitoring } from './load-monitoring.model'

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

export function LoadMonitoringGraphView({
  loads,
  highLoadThreshold
}: LoadMonitoring): ReactElement<LoadMonitoring> {
  if (loads.length < 2) {
    return <LoadingData/>
  }
  const getHighLoadThreshold = () => highLoadThreshold
  const loadAxisPadding = 0.05

  const xAxisValues = loads.map(getLoadUtcTime)
  const dataDomain: DomainPropType = {
    x: [Math.min(...xAxisValues), Math.max(...xAxisValues)],
    y: [0, loadAxisPadding + Math.max(highLoadThreshold, ...loads.map(getLoadValue))]
  }

  const now = Date.now()
  const highAverageLoad = isRecentAverageLoadHigh({
    loads, highLoadThreshold
  }, () => now)

  const timezoneOffset = new Date().getTimezoneOffset() * minute
  const formatLoadUtcTime = (x: Timestamp) => new Date(x + timezoneOffset).toLocaleTimeString()

  return <Fragment>
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
  </Fragment>
}
