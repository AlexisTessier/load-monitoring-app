const SseChannel = require('sse-channel')
const http = require('http')
const shell = require('shelljs')

const SECOND = 1000
const MINUTE = 60 * SECOND

const port = process.env.SERVER_PORT
const clientPort = process.env.CLIENT_PORT
const historyDuration = 10 * MINUTE
const updateInterval = 10 * SECOND

const loadChannel = new SseChannel({
  historySize: parseInt(historyDuration / updateInterval, 10),
  jsonEncode: true,
  cors: {
    origins: [`http://localhost:${clientPort}`]
  }
})

function currentLoad(){
  const loadAverageIndex = 5
  return [shell.exec('uptime').stdout.split(' ')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  [loadAverageIndex]].map(load => parseFloat(load))[0]
}

setInterval(()=>{
  const id = Date.now()
  console.log(`update ${id}`)
  const data = {
    timestamp: id,
    load: currentLoad()
  }

  loadChannel.send({
    id,
    event: 'update',
    data
  });
}, updateInterval)

http.createServer(function(req, res) {
  console.log(`request url: ${req.url}`)

  if (req.url.indexOf('/channel/load') === 0) {
    loadChannel.addClient(req, res)
    
    const sinceId = Date.now() - historyDuration
    console.log(`send history since ${sinceId}`)
    loadChannel.sendEventsSinceId(res, sinceId)
  } else {
    res.writeHead(404)
    res.end()
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${port}/`)
});