import Rx from 'rx'
import http from 'http'

const srv = http.createServer()
const request$ = Rx.Observable
	.fromEvent(srv, 'request', (req, res) => { return {req: req, res: res} } )
	.map(r => {
		r.method = r.req.method
		r.url = r.req.url
		return r
	})

request$.subscribe((r) => {
	r.res.writeHead(200, {
		'Content-Type': 'text'
	})
	r.res.end(`${r.method}, ${r.url}\n`)
})

srv.listen(3001)
