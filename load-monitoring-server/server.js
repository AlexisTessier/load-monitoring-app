const SseChannel = require('sse-channel')
const http = require('http')
const shell = require('shelljs')

const SECOND = 1000
const MINUTE = 60 * SECOND

const port = process.env.SERVER_PORT
const clientPort = process.env.CLIENT_PORT
const historyDuration = 10 * MINUTE
const updateInterval = 10 * SECOND

const uptimeChannel = new SseChannel({
  historySize: parseInt(historyDuration / updateInterval, 10),
  jsonEncode: true,
  cors: {
    origins: [`http://localhost:${clientPort}`]
  }
})

function uptime(){
  const stdout = shell.exec('uptime').stdout.trim()
  const uptimeTable = stdout.split(' ')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return {
    stdout,
    utcTime: Date.now(),
    averageLoads:{
      lastMinute: parseFloat(uptimeTable[5]),
      last5Minutes: parseFloat(uptimeTable[6]),
      last15Minutes: parseFloat(uptimeTable[7])
    }
  }
}

setInterval(()=>{
  console.log(`update uptime channel`)
  const data = uptime()
  console.log(data)

  uptimeChannel.send({
    id: data.utcTime,
    event: 'update',
    data
  });
}, updateInterval)

http.createServer(function(req, res) {
  console.log(`request url: ${req.url}`)

  if (req.url.indexOf('/channel/uptime') === 0) {
    uptimeChannel.addClient(req, res)
    
    const sinceId = Date.now() - historyDuration
    console.log(`send history since ${sinceId}`)
    uptimeChannel.sendEventsSinceId(res, sinceId)
  } else {
    res.writeHead(404)
    res.end()
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${port}/`)
});