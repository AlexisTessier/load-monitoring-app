import { Store, StoreUpdateHandler, waitForUpdate, updateStore } from '../../mvc'
import { minute } from '../../constants/durations'

import { UptimeChannelStore } from '../uptime-channel/uptime-channel.store'
import {
  getUpdateEventUtcTime,
  getUpdateEventLastMinuteAverageLoad
} from '../uptime-channel/uptime-channel.model'

import { LoadMonitoring, LoadValue, Load } from './load-monitoring.model'

export interface LoadMonitoringStore extends Store<LoadMonitoring> {}

export function createLoadMonitoringStore({
  highLoadThreshold,
  uptimeChannelStore
}: {
  highLoadThreshold: LoadValue,
  uptimeChannelStore: UptimeChannelStore
}): LoadMonitoringStore {
  let updateHandlers: StoreUpdateHandler<LoadMonitoring>[] = []
  let loads: Load[] = []
  let model: LoadMonitoring = {
    loads,
    highLoadThreshold
  }

  function update(){
    let error: Error

    uptimeChannelStore.waitForUpdate()
      .then(uptimeChannel => {
        loads = uptimeChannel.updateEvents.map(_ => ({
          utcTime: getUpdateEventUtcTime(_),
          value: getUpdateEventLastMinuteAverageLoad(_)
        }))
      })
      .catch(err => error = err)
      .then(()=>{
        model = { loads, highLoadThreshold }
        updateStore({model, updateHandlers, error})
        update()
      })
  }

  update()

  return {
    get model(){
      return model
    },
    waitForUpdate(){
      return waitForUpdate({updateHandlers})
    }
  }
}