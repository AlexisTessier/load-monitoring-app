import React, { ReactElement, Fragment } from 'react'
import styled from 'styled-components'

import { Timestamp } from '../../definitions'

import { minute } from '../../constants/durations'

import { NotificationChannel, NotificationChannelEvent } from './notification-channel.model'

const Label = styled.span`
	font-weight: bold;
	margin-right: 8px;
`

function formatTime(time: Timestamp){
	const timezoneOffset = new Date().getTimezoneOffset() * minute
	return new Date(time + timezoneOffset).toLocaleTimeString()
}

function alertMessage(value: number, time: Timestamp) {
	return `High load generated an alert - load = ${value}, triggered at ${formatTime(time)}`
}

function recoveryMessage(time: Timestamp) {
	return `Load recovered from previous high load alert at ${formatTime(time)}`
}

function Toast({
	utcTime,
	averageLoad,
	type
}: NotificationChannelEvent){
	return <Fragment>
		{type === 'alert' ? alertMessage(averageLoad, utcTime) : recoveryMessage(utcTime)}
		<hr/>
	</Fragment>
}

export function NotificationChannelMessagesThreadView({
	notifyEvents
}: NotificationChannel): ReactElement<NotificationChannel> {
	return <Fragment>{notifyEvents.map((evt, i) => <Toast key={i} {...evt}/>)}</Fragment>
}