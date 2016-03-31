import Rx from 'rx'
import http from 'http'
import fs from 'fs'

const srv = http.createServer()
let request$ = Rx.Observable
	.fromEvent(srv, 'request', (req, res) => { 
		return {req, res, url: req.url, method: req.method} 
	})
	.subscribe(r => {
		if (r.url === '/') {
			r.res.writeHead(200, {
				'Content-Type': 'text'
			})
			fs.createReadStream(`${__dirname}/../public/index.html`)
				.pipe(r.res)
		} else {
			r.res.writeHead(404)
			r.res.end()
			console.log(`not found ${r.url}`);
		}
	})

srv.listen(3001)
