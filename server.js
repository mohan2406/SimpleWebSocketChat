const http = require("http");
const fs = require("fs");
const websocket = require("ws");


const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const html = fs.readFileSync("index.html");
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.end(html);
  }
});


const wss = new websocket.Server({
  server,
  path: "/chat"
});

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.send("Welcome to the chat!");

  socket.on("message", (message) => {
    console.log("Received: ", message.toString());

    for (const client of wss.clients) {
      if (client.readyState === websocket.OPEN) {
        client.send(message.toString());
      }
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
