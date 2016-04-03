import most from 'most'
import http from 'http'
import send from 'send'

const srv = http.createServer()
let request$ = most.create(add => {
	srv.on('request', (req, res) => { 
		add({req, res, url: req.url, method: req.method})
	})
})
request$.observe(r => {
		if (false) {
		} else {
			send(r.req, r.url, {
				root: `${__dirname}/../../public`,
			}).pipe(r.res)
		}
	})

srv.listen(3001)