import { Store, StoreUpdateHandler, waitForUpdate, updateStore } from '../../mvc'

import { UptimeChannelStore } from '../uptime-channel/uptime-channel.store'
import { getUpdateEventStdout } from '../uptime-channel/uptime-channel.model'

import { KeyStatistics } from './key-statistics.model'

export interface KeyStatisticsStore extends Store<KeyStatistics> {}

export function createKeyStatisticsStore({
  uptimeChannelStore
}: {
  uptimeChannelStore: UptimeChannelStore
}): KeyStatisticsStore {
  let updateHandlers: StoreUpdateHandler<KeyStatistics>[] = []
  let uptime = ''
  let model: KeyStatistics = {
    uptime
  }

  function update(){
    let error: Error

    uptimeChannelStore.waitForUpdate()
      .then(uptimeChannel => {
        const events = uptimeChannel.updateEvents
        const lastEvent = events[events.length-1]
        uptime = lastEvent.stdout
      })
      .catch(err => error = err)
      .then(()=>{
        model = { uptime }
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