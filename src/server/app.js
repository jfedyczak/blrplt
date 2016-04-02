import Rx from 'rx'
import http from 'http'
import send from 'send'

let publicFiles = []

const srv = http.createServer()
let request$ = Rx.Observable
	.fromEvent(srv, 'request', (req, res) => { 
		return {req, res, url: req.url, method: req.method} 
	})
	.subscribe(r => {
		if (false) {
		} else {
			send(r.req, r.url, {
				root: `${__dirname}/../../public`,
			}).pipe(r.res)
		}
	})

srv.listen(3001)