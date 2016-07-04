import http from 'http'
import send from 'send'

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

const srv = http.createServer()
	.on('request', (req, res) => {
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
	}).listen(3001)