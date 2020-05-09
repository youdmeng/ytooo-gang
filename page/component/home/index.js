var bsurl = require('../../../utils/bsurl.js');
var common = require('../../../utils/util.js');
var async = require("../../../utils/async.js");
var nt = require("../../../utils/nt.js")
var playlists = require("../../../data/playlists.js")
var app = getApp();
Page({
    data: {
        playlist: {
            idx: 1, 
            loading: false,
            list: [],
            offset: 0,
            limit: 5
        },
        djcate: { loading: false },
        djrecs: {},
        sort: {
            idx: 3, loading: false
        },
        catelist: {
            res: {},
            checked: {}
        },
        tabidx: 0,
        music: {},
        playing: false,
        playtype: 1
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '德刚音频大全'
          })
       var playlist= {
            idx: 1, 
            loading: true,
            list:  playlists.playlists(),
            offset: 0,
            limit: 5
        }
        this.setData({
            playlist: playlist,
            music: app.globalData.curplay
        })
        // this.gplaylist(false)
    },
    onShow : function(options){
        this.setData({
            music: app.globalData.curplay,
            playing: app.globalData.playing
        })
        
    },
    toggleplay: function () {
        common.toggleplay(this, app);
    },
    playnext: function (e) {
        app.nextplay(e.currentTarget.dataset.pt)
        this.setData({
            music: app.globalData.curplay,
            playing: app.globalData.playing
        })
    },
    gplaylist: function (isadd) {
        // debugger
        //分类歌单列表
        var that = this;
        wx.request({
            url: bsurl + 'top/playlist',
            data: {
                limit: that.data.playlist.limit,
                offset: that.data.playlist.offset,
                type: '全部歌单'
            },
            complete: function (res) {
                that.data.playlist.loading = true;
                if (!isadd) {
                    that.data.playlist.list = res.data
                } else {
                    res.data.playlists = that.data.playlist.list.playlists.concat(res.data.playlists);
                    that.data.playlist.list = res.data
                }
                that.data.playlist.offset += res.data.playlists.length;
                that.setData({
                    playlist: that.data.playlist
                })
                // console.log("=================")
                // console.log(that.data.playlist.list.playlists);
                // console.log("=================")
            }
        })
    },
    onReachBottom: function () {
        this.gplaylist(true);//更多歌单
    }
})