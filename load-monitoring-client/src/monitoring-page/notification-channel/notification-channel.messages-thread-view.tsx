import React, { Fragment, ReactElement } from 'react'

import { Timestamp } from '../../definitions'

import { minute } from '../../constants/durations'

import { NotificationChannel, NotificationChannelEvent } from './notification-channel.model'

function formatTime(time: Timestamp): string {
  const timezoneOffset = new Date().getTimezoneOffset() * minute
  return new Date(time + timezoneOffset).toLocaleTimeString()
}

function alertMessage(value: number, time: Timestamp): string {
  return `High load generated an alert - load = ${value}, triggered at ${formatTime(time)}`
}

function recoveryMessage(time: Timestamp): string {
  return `Load recovered from previous high load alert at ${formatTime(time)}`
}

function Message({
  utcTime,
  averageLoad,
  type
}: NotificationChannelEvent): ReactElement<NotificationChannelEvent> {
  return <Fragment>
    {type === 'alert' ? alertMessage(averageLoad, utcTime) : recoveryMessage(utcTime)}
    <hr/>
  </Fragment>
}

export function NotificationChannelMessagesThreadView({
  notifyEvents
}: NotificationChannel): ReactElement<NotificationChannel> {
  return <Fragment>{notifyEvents.map((evt, i) => <Message key={i} {...evt}/>)}</Fragment>
}
