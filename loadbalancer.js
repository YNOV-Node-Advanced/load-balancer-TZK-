const http = require("http");
const PORTS = process.env.PORTS.split(",") || [];
const PORT = process.env.PORT || 3000;

const server = http.createServer().listen(PORT);

let portIndex = 0;

function roundRobinPort() {
    const port = PORTS[portIndex];
    portIndex++;

    if (portIndex > PORTS.length - 1) {
        portIndex = 0;
    }

    return port;
}

function randomPort() {
    return PORTS[Math.floor(Math.random() * (PORTS.length - 1))];
}

server.on("request", (request, response) => {
    const proxy = http.request(
        {
            host: "localhost",
            port: roundRobinPort(),
            path: request.url,
            method: request.method,
            headers: request.headers
        },
        forwardedResponse => forwardedResponse.pipe(response)
    );

    request.pipe(proxy);

    proxy.on("error", error => {
        response.writeHead(503);
        response.write("Service unavailable.")
        response.end();
    });
});
