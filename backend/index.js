const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const mainRouter = require("./routes/main.router");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/", mainRouter);
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
