import { ExpressPeerServer } from "peer";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: "/",
  debug: true,
});

app.use("/peerjs", peerServer);

const PORT = 3001;
server.listen(PORT, () => console.log(`PeerJS server running on port ${PORT}`));
