const fs = require('fs')
const p = 'node_modules/react-dom/cjs/react-dom-server.node.development.js'
const s = fs.readFileSync(p, 'utf8')
const idx = s.indexOf('retryNode(request, task)')
console.log('idx:', idx)
if (idx >= 0) {
  const before = s.slice(Math.max(0, idx - 1000), idx)
  const after = s.slice(idx + 26, idx + 1000)
  console.log('antes:', before.replace(/[\r\n]/g, ' '))
  console.log('despues:', after.replace(/[\r\n]/g, ' '))
}
