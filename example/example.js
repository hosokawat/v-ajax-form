const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      title: "",
      auther: "",
      message: "[init]",
    };
  },
  methods: {
    start: function (params) {
      this.state_logging("start");
    },
    receive: function (res) {
      try {
        this.title = res.data[0].summary.title;
        this.auther = res.data[0].summary.author;
      } catch (err) {
        this.title = "NO TITLE";
        this.auther = "NO AUTHOR";
      }
      this.state_logging("success");
    },
    fail: function (e) {
      this.title = "リクエスト失敗";
      this.auther = "";
      this.state_logging("fail");
    },
    done: function (e) {
      this.state_logging("done");
    },
    state_logging: function (state) {
      this.message += `-> [${state}]`;
    },
  },
});

// プラグインを登録
app.use(VAjaxForm);

// アプリケーションをマウント
app.mount("#app");
