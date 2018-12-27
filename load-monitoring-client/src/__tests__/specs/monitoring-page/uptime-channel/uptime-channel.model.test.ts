import {
  getUpdateEventLastMinuteAverageLoad,
  getUpdateEventStdout,
  getUpdateEventUtcTime,
  tryCreateUptimeChannelUpdateEvent,
  UptimeChannelUpdateEvent
} from '../../../../monitoring-page/uptime-channel/uptime-channel.model'

test('update event stdout getter function', () => {
  const event = <UptimeChannelUpdateEvent> {
    stdout: 'uptime stdout'
  }

  expect(getUpdateEventStdout(event)).toBe('uptime stdout')
})

test('update event utctime getter function', () => {
  const event = <UptimeChannelUpdateEvent> {
    utcTime: 42
  }

  expect(getUpdateEventUtcTime(event)).toBe(42)
})

test('update event last minute average load getter function', () => {
  const event = <UptimeChannelUpdateEvent> {
    averageLoads: {
      lastMinute: 0.6
    }
  }

  expect(getUpdateEventLastMinuteAverageLoad(event)).toBe(0.6)
})

describe('tryCreateUptimeChannelUpdateEvent', () => {
  test('should handle a valid object', () => {
    const json: any = {
      stdout: 'a string',
      utcTime: 1234,
      averageLoads: {
        lastMinute: 4,
        last5Minutes: 5,
        last15Minutes: 6,
        other: 56
      },
      otherKey: 'azerty'
    }

    const expected: UptimeChannelUpdateEvent = {
      stdout: 'a string',
      utcTime: 1234,
      averageLoads: {
        lastMinute: 4,
        last5Minutes: 5,
        last15Minutes: 6
      }
    }

    expect(json).not.toEqual(expected)
    expect(tryCreateUptimeChannelUpdateEvent(json)).toEqual(expected)
  })

  describe('error cases', () => {
    const baseErrorMessage = `Failed to create a UptimeChannelUpdateEvent from raw value.`

    test('raw is not an object', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>42)
      }).toThrowError(`${baseErrorMessage} raw is not an object (42)`)
    })

    test('stdout is not a string', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>{
          stdout: 7
        })
      }).toThrowError(`${baseErrorMessage} raw.stdout is not a string (7)`)
    })

    test('utcTime is not a number', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>{
          stdout: 'astring',
          utcTime: 'a'
        })
      }).toThrowError(`${baseErrorMessage} raw.utcTime is not a number (a)`)
    })

    test('averageLoads is not an object', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>{
          stdout: 'string',
          utcTime: 42,
          averageLoads: 87
        })
      }).toThrowError(`${baseErrorMessage} raw.averageLoads is not an object (87)`)
    })

    test('averageLoads.lastMinute is not a number', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>{
          stdout: 'astring',
          utcTime: 42,
          averageLoads: {
            lastMinute: 'a'
          }
        })
      }).toThrowError(`${baseErrorMessage} raw.averageLoads.lastMinute is not a number (a)`)
    })

    test('averageLoads.last5Minutes is not a number', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>{
          stdout: 'astring',
          utcTime: 1234,
          averageLoads: {
            lastMinute: 0.8,
            last5Minutes: 'b'
          }
        })
      }).toThrowError(`${baseErrorMessage} raw.averageLoads.last5Minutes is not a number (b)`)
    })

    test('averageLoads.last15Minutes is not a number', () => {
      expect(() => {
        tryCreateUptimeChannelUpdateEvent(<any>{
          stdout: 'astring',
          utcTime: 98,
          averageLoads: {
            lastMinute: 0.8,
            last5Minutes: 0.7,
            last15Minutes: '3'
          }
        })
      }).toThrowError(`${baseErrorMessage} raw.averageLoads.last15Minutes is not a number (3)`)
    })

  })
})
