import most from 'most'
import http from 'http'
import send from 'send'

const srv = http.createServer()

most.fromEvent('request', srv)
.observe(([req, res]) => {
	if (false) {
		// non-static route will be served here
	} else {
		send(req, req.url, {
			root: `${__dirname}/../../public`,
		}).pipe(res)
	}
})

srv.listen(3001)