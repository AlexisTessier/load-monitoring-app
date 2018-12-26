import React, { Fragment, ReactElement } from 'react'
import styled from 'styled-components'

import { KeyStatistics } from './key-statistics.model'

const Label = styled.span`
	font-weight: bold;
	margin-right: 8px;
`

export function KeyStatisticsTextView({
  uptime
}: KeyStatistics): ReactElement<KeyStatistics> {
  return <Fragment><Label>uptime stdout</Label> {uptime}</Fragment>
}
