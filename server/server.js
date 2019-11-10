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

async function runSample(
  msg,
  socket,
  projectId = "grantdialogflownode-fwoaqv"
) {
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
        text: msg,
        // The language used by the client (en-US)
        languageCode: "en-US"
      }
    }
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  if (result) {
    socket.emit("resMsg", result.fulfillmentText);
  } else {
    socket.emit("resMsg", "未能获取正确的数据响应");
  }
}

async function voicetotext(wav) {
  const speech = require("@google-cloud/speech");
  const client = new speech.SpeechClient({
    keyFilename: path.join(__dirname, "./GrantDialogflowNode-02f1c9fcdbb6.json")
  });
  const audioBytes = wav.toString("base64");
  const audio = {
    content: audioBytes
  };
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US"
  };
  const request = {
    audio: audio,
    config: config
  };
  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}

async function dialogflowspeechtotext(
  wav,
  socket,
  projectId = "grantdialogflownode-fwoaqv"
) {
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, "./GrantDialogflowNode-02f1c9fcdbb6.json")
  });
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  const inputAudio = wav;
  const request = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding: "AUDIO_ENCODING_LINEAR_16",
        sampleRateHertz: 16000,
        languageCode: "en-US"
      }
    },
    inputAudio: inputAudio
  };

  // Recognizes the speech in the audio and detects its intent.
  const [response] = await sessionClient.detectIntent(request);
  console.log(`---Query: ${response.queryResult.queryText}`);
  console.log(`---Response: ${response.queryResult.fulfillmentText}`);
  socket.emit("queryText", response.queryResult.queryText);
  setTimeout(
    socket.emit("fulfillmentText", response.queryResult.fulfillmentText),
    1000
  );
}

io.on("connection", socket => {
  console.log("新用户连接成功");

  socket.on("chat message", msg => {
    console.log(msg);
    runSample(msg, socket);
  });
  socket.on("voice", wav => {
    voicetotext(wav);
    dialogflowspeechtotext(wav, socket);
  });
  socket.on("disconnect", () => {
    console.log("用户连接断开");
  });
});

http.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});
