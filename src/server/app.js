import most from 'most'
import http from 'http'
import send from 'send'

const srv = http.createServer()

const sendFile = (req, res, url) => {
	send(req, url, {
		root: "#{__dirname}/../public/"
	}).pipe(res)
}

const sendJson = (req, res, data) => {
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(data))
}

const sendStatus = (req, res, statusCode) => {
	res.statusCode = statusCode
	res.end()
}

most.fromEvent('request', srv)
.observe(([req, res]) => {
	if (req.url == "/api/test") {
		console.log("sending test");
		sendJson(req, res, {
			test: 'XHR answer'
		})
	} else {
		send(req, req.url, {
			root: `${__dirname}/../../public`,
		}).pipe(res)
	}
})

srv.listen(3001)