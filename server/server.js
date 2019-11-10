require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 9191;

app.get("/", (req, res) => {
  res.send("Hello ChatBot!!!");
});

io.on("connection", socket => {
  console.log("新用户连接成功");
  socket.on("disconnect", () => {
    console.log("用户连接断开");
  });
});

http.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});
