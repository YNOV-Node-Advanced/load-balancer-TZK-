const http = require("http");
const PORTS = (process.env.PORTS).split(',') || [];
const PORT = process.env.PORT || 3000;

const server = http.createServer().listen(PORT);

let portIndex = 0;

function roundRobinPort () {
    const port = PORTS[portIndex];
    portIndex++;

    if (portIndex > PORTS.length - 1) {
        portIndex = 0;
    }

    return port;
}

function randomPort () {
    return PORTS[Math.floor(Math.random() * (PORTS.length - 1))];
}

server.on("request", (req, res) => {
    const connector = http.request(
        {
            host: 'localhost',
            port: roundRobinPort(),
            path: req.url,
            method: req.method,
            headers: req.headers
        },
        resp => resp.pipe(res)
    );

    req.pipe(connector);
});
