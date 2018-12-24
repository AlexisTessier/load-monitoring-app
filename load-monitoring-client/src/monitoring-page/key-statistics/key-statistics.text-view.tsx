import React, { Fragment } from 'react'
import styled from 'styled-components'

import { ViewElement } from '../../mvc'

import { KeyStatistics } from './key-statistics.model'

const Label = styled.span`
	font-weight: bold;
	margin-right: 8px;
`

export function TextView({
	uptime
}: KeyStatistics): ViewElement {
	return <Fragment><Label>uptime stdout</Label> {uptime}</Fragment>
}