import {
  getLoadUtcTime,
  getLoadValue,
  isRecentAverageLoadHigh,
  Load,
  LoadMonitoring,
  loadMonitoringFrom
} from '../../../../monitoring-page/load-monitoring/load-monitoring.model'

import { minute } from '../../../../constants/durations'

test('Load value getter', () => {
  expect(getLoadValue(<Load>{
    value: 0.42
  })).toBe(0.42)
})

test('Load utcTime getter', () => {
  expect(getLoadUtcTime(<Load>{
    utcTime: 9876
  })).toBe(9876)
})

test('create load monitoring from uptime channel', () => {
  const loadMonitoring: LoadMonitoring = loadMonitoringFrom({
    highLoadThreshold: 0.22,
    uptimeChannel: {
      updateEvents: [{
        stdout: 'out1',
        utcTime: 41,
        averageLoads: {
          lastMinute: 1,
          last5Minutes: 2,
          last15Minutes: 3
        }
      }, {
        stdout: 'out2',
        utcTime: 42,
        averageLoads: {
          lastMinute: 2,
          last5Minutes: 3,
          last15Minutes: 4
        }
      }]
    }
  })

  expect(loadMonitoring).toEqual(<LoadMonitoring>{
    highLoadThreshold: 0.22,
    loads: [{
      utcTime: 41,
      value: 1
    }, {
      utcTime: 42,
      value: 2
    }]
  })
})

describe('isRecentAverageLoadHigh', () => {
  const now = 6000
  const getDateNow = () => now
  const filteredTime = now - 1 - (2 * minute)
  const notFilteredTime = now - (2 * minute)

  test('high case', () => {
    const loadMonitoring: LoadMonitoring = {
      highLoadThreshold: 3.4,
      loads: [{
        utcTime: notFilteredTime,
        value: 2
      }, {
        utcTime: notFilteredTime,
        value: 3
      }, {
        utcTime: notFilteredTime,
        value: 4
      }, {
        utcTime: notFilteredTime,
        value: 5
      }]
    }

    expect(isRecentAverageLoadHigh(loadMonitoring, getDateNow)).toBe(true)
  })

  test('low case', () => {
    const loadMonitoring: LoadMonitoring = {
      highLoadThreshold: 3.5,
      loads: [{
        utcTime: notFilteredTime,
        value: 2
      }, {
        utcTime: notFilteredTime,
        value: 3
      }, {
        utcTime: notFilteredTime,
        value: 4
      }, {
        utcTime: notFilteredTime,
        value: 5
      }]
    }

    expect(isRecentAverageLoadHigh(loadMonitoring, getDateNow)).toBe(false)
  })

  test('high case with filter', () => {
    const loadMonitoring: LoadMonitoring = {
      highLoadThreshold: 3.5,
      loads: [{
        utcTime: filteredTime,
        value: 2
      }, {
        utcTime: notFilteredTime,
        value: 4
      }, {
        utcTime: notFilteredTime,
        value: 5
      }, {
        utcTime: notFilteredTime,
        value: 6
      }]
    }

    expect(isRecentAverageLoadHigh(loadMonitoring, getDateNow)).toBe(true)
  })

  test('low case with filter', () => {
    const loadMonitoring: LoadMonitoring = {
      highLoadThreshold: 3.4,
      loads: [{
        utcTime: notFilteredTime,
        value: 2
      }, {
        utcTime: notFilteredTime,
        value: 4
      }, {
        utcTime: filteredTime,
        value: 5
      }, {
        utcTime: filteredTime,
        value: 6
      }]
    }

    expect(isRecentAverageLoadHigh(loadMonitoring, getDateNow)).toBe(false)
  })
})
