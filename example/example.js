var app = new Vue({
  el: '#app',
  data: {
    title: '',
    auther: '',
    message: '[init]'
  }, methods: {
    start: function (params) {
      this.state_logging('start');
      console.log('1.start')
    },
    receive: function (res) {
      try {
        this.title = res.data[0].summary.title;
        this.auther = res.data[0].summary.author;
      } catch (err) {
        this.title = 'そんなものない';
        this.auther = 'よみ人しらず';
      }
      this.state_logging('success');
      console.log('2.success')
    }, fail: function (e) {
      this.title = 'リクエスト失敗';
      this.auther = '';
      this.state_logging('fail');
      console.log('2.fail')
    }, done: function (e) {
      this.state_logging('done');
      console.log('3.done')
    }, state_logging: function (state) {
      if (this.message.length > 200) {
        this.message = ''
      }
      this.message += `-> [${state}]`;
    }
  }
})