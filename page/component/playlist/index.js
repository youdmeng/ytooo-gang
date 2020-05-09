var app = getApp();
var bsurl = require('../../../utils/bsurl.js');
var id2Url = require('../../../utils/base64md5.js');
var nt = require("../../../utils/nt.js")
var common = require('../../../utils/util.js');
var jinguqiguan = require("../../../data/jinguqiguan.js")
Page({
  data: {
    list: [],
    count: 0,
    curplay: {},
    name:'',
    description:'',
    pid: 0,
    cover: '',
    music: {},
    playing: false,
    playtype: 1,
    loading: true,
    toplist: false,
    duration: '00:00',
    durationTime: 0,
    playtime: '00:00',
    percent: 0.1,
    user: wx.getStorageSync('user') || {}
  },
   
  toggleplay: function () {
    common.toggleplay(this, app);
  },
  playnext: function (e) {
    app.nextplay(e.currentTarget.dataset.pt)
  },
  music_next: function (r) {
    this.setData({
      music: r.music,
      playtype: r.playtype,
      curplay: r.music.id
    })
  },
  music_toggle: function (r) {
    this.setData({
      playing: r.playing,
      music: r.music,
      playtype: r.playtype,
      curplay: r.music.id
    })
  },
  onShow: function () {
    nt.addNotification("music_next", this.music_next, this);
    nt.addNotification("music_toggle", this.music_toggle, this);
    this.setData({
      curplay: app.globalData.curplay.id,
      music: app.globalData.curplay,
      playing: app.globalData.playing,
      playtype: app.globalData.playtype,
      playtime:'00:00',
      durationTime : app.globalData.curplay.timeTotal * 1000,
      duration :  common.formatduration(app.globalData.curplay.timeTotal * 1000)
    });
    var that = this;
    setInterval(function () {
      common.playAlrc(that, app);
   }, 1000);
  },
  onHide: function () {
    nt.removeNotification("music_next", this)
    nt.removeNotification("music_toggle", this)
  },
  lovesong:function(){
    common.songheart(this,app, 0,(this.data.playtype==1? this.data.music.st:this.data.music.starred));
  },
  onLoad: function (options) {
    var that = this;
    if (options.pid == 1){
      var musicList = jinguqiguan.jinguqiguan().jinguqiguan
    }
    var canplay = [];
    for (let i = 0; i < musicList.length; i++) {
      canplay.push(musicList[i])     
    }
    that.setData({
      cover: options.img,
      name: options.name,
      description: options.description,
      list: musicList,
      canplay: canplay,
      toplist: true,
      count: musicList.length,
      playtime:'00:00',
      durationTime : app.globalData.curplay.timeTotal * 1000,
      duration : common.formatduration(app.globalData.curplay.timeTotal * 1000)
    });
    wx.setNavigationBarTitle({
      title: options.name
    });
    setInterval(function () {
       common.playAlrc(that, app);
    }, 1000);

  },
  
  userplaylist: function (e) {
    var userid = e.currentTarget.dataset.userid;
    wx.redirectTo({
      url: '../user/index?id=' + userid
    })
  },
  playall: function (event) {
    var that = this;
    that.setData({
      durationTime : this.data.canplay[0].timeTotal * 1000,
      duration :  common.formatduration(app.globalData.curplay.timeTotal * 1000)
    })
    this.setplaylist(this.data.canplay[0], 0);
    app.seekmusic(1)

  },
  playthis: function (event) {
    var that = this;
    var t = event.currentTarget.dataset.index
    this.setplaylist(this.data.canplay[t], t);
    app.seekmusic(1)
    that.setData({
      durationTime : app.globalData.curplay.timeTotal * 1000,
      duration :  common.formatduration(app.globalData.curplay.timeTotal * 1000)
    })
    console.log(this.data.duration);
    

  },
  // 进度条拖拽
  sliderChange(e) {
    var that = this
    var offset = parseInt(e.detail.value);
    app.globalData.currentPosition = offset / 1000;
    app.seekmusic(app.globalData.playtype, app.globalData.currentPosition);
    
  },
  setplaylist: function (music, index) {
    //设置播放列表，设置当前播放音乐，设置当前音乐在列表中位置
    app.globalData.curplay = app.globalData.curplay.id != music.id ? music : app.globalData.curplay;
    app.globalData.index_am = index;//event.currentTarget.dataset.idx;
    app.globalData.playtype = 1;
    var shuffle = app.globalData.shuffle;
    app.globalData.list_sf = this.data.canplay;//this.data.list.tracks;
    app.shuffleplay(shuffle);
    app.globalData.globalStop = false;
  },
  playmusic: function (event) {
    let music = event.currentTarget.dataset.idx;
    let st = event.currentTarget.dataset.st;
    if (st * 1 < 0) {
      wx.showToast({
        title: '歌曲已下架',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    music = this.data.list.playlist.tracks[music];
    this.setplaylist(music, event.currentTarget.dataset.idx)
  }
});