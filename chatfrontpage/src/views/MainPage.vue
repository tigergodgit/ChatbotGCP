<template>
  <div class="box" style="width: 100%; background: #fff; padding: 8px;">
    <div class="headernav">
      <mu-appbar class="appbar" style="width: 100%;" color="indigo900">
        <div class="icon"></div>
        <div class="text">CELINE Demo</div>
      </mu-appbar>
    </div>
    <div class="chatbox">
      <div class="chatheader">
        <div class="chaticon"></div>
        <div class="chattitle"></div>
      </div>
      <div class="chatbody">
        <mu-list>
          <mu-list-item v-for="(item,index) in  messageList" :key="index">{{item}}</mu-list-item>
        </mu-list>
      </div>
      <div class="chatinput">
        <div class="inputtext">
          <mu-text-field
            v-model="message"
            label="please send a message"
            full-width
            @keyup.enter="dealmessage"
          ></mu-text-field>
        </div>
        <div class="sendbutton">
          <mu-button small fab color="red" @click="dealmessage">
            <mu-icon value="send"></mu-icon>
          </mu-button>
        </div>
        <div class="voicebutton">
          <mu-button fab small color="pink" @click="startvoice">
            <mu-icon value="android"></mu-icon>
          </mu-button>
        </div>
        <div class="voicebutton">
          <mu-button fab small color="black" @click="stopvoice">
            <mu-icon value="android"></mu-icon>
          </mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      message: "",
      messageList: ["Hello,I am chatbot ,do you have any questions???"]
    };
  },
  methods: {
    dealmessage() {
      this.$socket.emit("chat message", this.message);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic");
@import url("https://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css");

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.headernav {
  display: flex;
  width: 100%;
  height: 50px;
}

.chatbox {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 600px;

  margin: 60px;
}
.chatheader {
  width: 100%;
  height: 80px;
  background-color: #303f9f;
}
.chatbody {
  width: 600px;
  height: 460px;
  background-color: #e3f2fd;
}
.chatinput {
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  width: 600px;
  height: 30px;
}
.inputtext {
  flex-grow: 1;
}
.sendbutton {
}
.voicebutton {
}
</style>