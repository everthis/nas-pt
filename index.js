const http = require("http")
const url = require("url"),
  path = require("path"),
  fs = require("fs")

const util = require("util")
const exec = util.promisify(require("child_process").exec)

function genCmd(searchPath = ".", str = "test") {
  return `find ${searchPath} -maxdepth 1 -name '*${str}*' -exec basename {} ';' | sort -n`
}

async function list() {
  const cmd = genCmd()
  const { stdout, stderr } = await exec(cmd)
  return stderr || stdout
}
async function requestListener(req, res) {  
  const p = url.format(req.url)
  if (p === "/list") {
    const ans = await list() 
    res.writeHead(200)
    res.end(ans)
  } else {
    res.writeHead(404)
    res.end(null)
  }
}

const server = http.createServer(requestListener)
server.listen(8080, "0.0.0.0")
