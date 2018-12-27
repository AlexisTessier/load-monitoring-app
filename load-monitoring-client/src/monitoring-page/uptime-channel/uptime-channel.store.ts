import EventEmitter from 'events'


import {
  tryCreateUptimeChannelUpdateEvent,
  UptimeChannel
} from './uptime-channel.model'

import { minute } from '../../constants/durations'
import { Timestamp } from '../../definitions'

export interface UptimeChannelStore {
  readonly model: UptimeChannel,
  readonly source: EventEmitter
}

export function createUptimeChannelStore({
  eventSource,
  dateNowGetter
}: {
  eventSource: EventSource,
  dateNowGetter: () => Timestamp
}): UptimeChannelStore {
  const source = new EventEmitter()
  const model: UptimeChannel = {
    updateEvents: []
  }

  eventSource.addEventListener('update', (evt: any) => {
    const message = evt as MessageEvent

    try {
      model.updateEvents.push(
        tryCreateUptimeChannelUpdateEvent(JSON.parse(message.data))
      )
    } catch (err) {
      throw new Error(
        `Error happened while parsing uptime channel update message:\n\t${err}`
      )
    }

    model.updateEvents = model.updateEvents.filter(_ => (
      dateNowGetter() - _.utcTime < 10 * minute
    ))
    .sort(({utcTime: a}, {utcTime: b}) => a > b ? 1 : (a < b ? -1 : 0))

    source.emit('update')
  })

  return {
    model,
    source
  }
}
