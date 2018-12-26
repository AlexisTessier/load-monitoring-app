const SseChannel = require('sse-channel')
const http = require('http')
const shell = require('shelljs')

const threshold = 1

const SECOND = 1000
const MINUTE = 60 * SECOND

const port = process.env.SERVER_PORT
const clientPort = process.env.CLIENT_PORT
const historyDuration = 10 * MINUTE
const updateInterval = 10 * SECOND

const cors = {
  origins: [`http://localhost:${clientPort}`]
}

const jsonEncode = true

const uptimeChannel = new SseChannel({
  historySize: parseInt(historyDuration / updateInterval, 10),
  jsonEncode, cors
})

function uptime(){
  const stdout = shell.exec('uptime').stdout.trim()
  const uptimeTable = stdout.split(' ')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  const end = uptimeTable.length

  return {
    stdout,
    utcTime: Date.now(),
    averageLoads:{
      lastMinute: parseFloat(uptimeTable[end-3]),
      last5Minutes: parseFloat(uptimeTable[end-2]),
      last15Minutes: parseFloat(uptimeTable[end-1])
    }
  }
}

const averageLoadHistorySize = parseInt(2 * MINUTE / updateInterval, 10)
const averageLoadHistory = []
let highAverageLoad = false

const notificationChannel = new SseChannel({
  historySize: 500,
  jsonEncode, cors
})

setInterval(()=>{
  console.log(`update uptime channel`)
  const data = uptime()
  console.log(data)

  uptimeChannel.send({
    id: data.utcTime,
    event: 'update',
    data
  });

  averageLoadHistory.push(data.averageLoads.lastMinute)
  if(averageLoadHistory.length === averageLoadHistorySize){
    const averageLoad = averageLoadHistory.reduce((a, b) => a + b, 0) / averageLoadHistorySize
    console.log(`average load: ${averageLoad}`)
    if(averageLoad > threshold){
      if(!highAverageLoad){
        notificationChannel.send({
          id: data.utcTime,
          event: 'notify',
          data: {
            utcTime: data.utcTime,
            type: 'alert',
            averageLoad
          }
        })
        highAverageLoad = true
      }
    }
    else if(highAverageLoad){
      notificationChannel.send({
        id: data.utcTime,
        event: 'notify',
        data: {
          utcTime: data.utcTime,
          type: 'recovery',
          averageLoad
        }
      })
      highAverageLoad = false
    }
    averageLoadHistory.shift()
  }
}, updateInterval)

http.createServer(function(req, res) {
  console.log(`request url: ${req.url}`)

  if (req.url.indexOf('/channel/uptime') === 0) {
    uptimeChannel.addClient(req, res)
    
    const sinceId = Date.now() - historyDuration
    console.log(`send history since ${sinceId}`)
    uptimeChannel.sendEventsSinceId(res, sinceId)
  }
  else if(req.url.indexOf('/channel/notification') === 0){
    notificationChannel.addClient(req, res)
    notificationChannel.sendEventsSinceId(res, -Infinity)
  }
  else {
    res.writeHead(404)
    res.end()
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${port}/`)
});