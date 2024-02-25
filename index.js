const { createServer } = require("http");
const app = require("./app");
require("dotenv").config();
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

require("./utils/io")(io);

httpServer.listen(process.env.PORT, () => {
  console.log("server listening on port " + process.env.PORT);
});
