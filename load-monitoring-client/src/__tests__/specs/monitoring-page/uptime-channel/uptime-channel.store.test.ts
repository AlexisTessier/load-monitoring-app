import {
  createUptimeChannelStore
} from '../../../../monitoring-page/uptime-channel/uptime-channel.store'

import {
  UptimeChannel, UptimeChannelUpdateEvent
} from '../../../../monitoring-page/uptime-channel/uptime-channel.model'

import { minute } from '../../../../constants/durations'

const dateNowGetter = () => Date.now()

describe('store creation', () => {
  test('model on creation', () => {
    const addEventListener = jest.fn()
    const store = createUptimeChannelStore({
      eventSource: <any>{
      addEventListener
      },
      dateNowGetter
    })

    expect(addEventListener).toHaveBeenCalledTimes(1)
    expect(store.model).toEqual(<UptimeChannel>{
      updateEvents: []
    })
  })

  test('updateEvents is updated', () => {
    let listener: any
    let event: any
    const addEventListener = jest.fn((evt, cb) => {
      event = evt
      listener = cb
    })

    const store = createUptimeChannelStore({
      eventSource: <any>{
      addEventListener
      },
      dateNowGetter
    })

    const event1: UptimeChannelUpdateEvent = {
      stdout: 'hello',
      utcTime: Date.now() - 5,
      averageLoads: {
      lastMinute: 1,
      last5Minutes: 2,
      last15Minutes: 3
      }
    }

    expect(event).toBe('update')

    listener({
      data: JSON.stringify(event1)
    })

    expect(store.model).toEqual(<UptimeChannel>{
      updateEvents: [
      event1
      ]
    })
  })

  test('source emit an update event', done => {
    let listener: any
    const addEventListener = jest.fn((evt, cb) => listener = cb)

    const store = createUptimeChannelStore({
      eventSource: <any>{
      addEventListener
      },
      dateNowGetter
    })

    const event1: UptimeChannelUpdateEvent = {
      stdout: 'hello',
      utcTime: Date.now(),
      averageLoads: {
      lastMinute: 1,
      last5Minutes: 2,
      last15Minutes: 3
      }
    }

    expect(store.model).toEqual(<UptimeChannel>{
      updateEvents: []
    })

    store.source.once('update', () => {
      expect(store.model).toEqual(<UptimeChannel>{
      updateEvents: [
        event1
      ]
      })

      done()
    })

    listener({
      data: JSON.stringify(event1)
    })
  })

  test('error is throwed in case of unvalid data', () => {
    let listener: any
    const addEventListener = jest.fn((evt, cb) => listener = cb)

    createUptimeChannelStore({
      eventSource: <any>{
      addEventListener
      },
      dateNowGetter
    })

    expect(() => {
      listener({
        data: JSON.stringify({key: 42})
      })
    }).toThrowError('Failed to create a UptimeChannelUpdateEvent from raw value. raw.stdout is not a string (undefined)')
  })

  test('events are sorted by utcTime and filtered if olders than 10 minutes', done => {
    let listener: any
    const addEventListener = jest.fn((evt, cb) => listener = cb)

    const now = Date.now()

    const store = createUptimeChannelStore({
      eventSource: <any>{
      addEventListener
      },
      dateNowGetter: () => now
    })

    const event0: UptimeChannelUpdateEvent = {
      stdout: 'event 0',
      utcTime: now - 10 * minute,
      averageLoads: {
      lastMinute: 1,
      last5Minutes: 2,
      last15Minutes: 3
      }
    }

    const event1: UptimeChannelUpdateEvent = {
      stdout: 'event 1',
      utcTime: now - 10 * minute + 1,
      averageLoads: {
      lastMinute: 1,
      last5Minutes: 2,
      last15Minutes: 3
      }
    }

    const event2: UptimeChannelUpdateEvent = {
      stdout: 'event 2',
      utcTime: now - 62,
      averageLoads: {
      lastMinute: 1,
      last5Minutes: 2,
      last15Minutes: 3
      }
    }

    const event3: UptimeChannelUpdateEvent = {
      stdout: 'event 3',
      utcTime: now - 10,
      averageLoads: {
      lastMinute: 2,
      last5Minutes: 3,
      last15Minutes: 4
      }
    }

    const event3bis: UptimeChannelUpdateEvent = {
      stdout: 'event 3bis',
      utcTime: now - 10,
      averageLoads: {
      lastMinute: 2,
      last5Minutes: 3,
      last15Minutes: 4
      }
    }

    expect(store.model).toEqual(<UptimeChannel>{
      updateEvents: []
    })

    let eventCount = 0
    store.source.on('update', () => {
      eventCount++
      if (eventCount === 1) {
      expect(store.model).toEqual(<UptimeChannel>{
        updateEvents: [
        event3
        ]
      })
      }
      if (eventCount === 2) {
      expect(store.model).toEqual(<UptimeChannel>{
        updateEvents: [
        event1, event3
        ]
      })
      }
      if (eventCount === 3) {
      expect(store.model).toEqual(<UptimeChannel>{
        updateEvents: [
        event1, event3
        ]
      })
      }
      if (eventCount === 4) {
      expect(store.model).toEqual(<UptimeChannel>{
        updateEvents: [
        event1, event2, event3
        ]
      })
      }
      if (eventCount === 5) {
      expect(store.model.updateEvents.length).toBe(4)

      const last = store.model.updateEvents[2]
      const lastBis = store.model.updateEvents[3]

      expect(last.stdout !== lastBis.stdout).toBe(true)
      expect(['event 3bis', 'event 3']).toContain(last.stdout)
      expect(['event 3bis', 'event 3']).toContain(lastBis.stdout)

      done()
      }
    })

    listener({
      data: JSON.stringify(event3)
    })

    listener({
      data: JSON.stringify(event1)
    })

    listener({
      data: JSON.stringify(event0)
    })

    listener({
      data: JSON.stringify(event2)
    })

    listener({
      data: JSON.stringify(event3bis)
    })
  })
})
