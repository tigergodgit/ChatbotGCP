require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const dialogflow = require("dialogflow");
const uuid = require("uuid");
const path = require("path");

const PORT = process.env.PORT || 9191;

app.get("/", (req, res) => {
  res.send("Hello ChatBot!!!");
});

async function runSample(projectId = "grantdialogflownode-fwoaqv") {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, "./GrantDialogflowNode-02f1c9fcdbb6.json")
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: "guo",
        // The language used by the client (en-US)
        languageCode: "en-US"
      }
    }
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

io.on("connection", socket => {
  console.log("新用户连接成功");

  socket.on("chat message", msg => {
    console.log(msg);
    runSample();
  });
  socket.on("disconnect", () => {
    console.log("用户连接断开");
  });
});

http.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});
