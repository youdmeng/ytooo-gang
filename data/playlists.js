function getPlaylists() {
    var playlists = {
            "playlists": [
                {
                    "name": "今古奇观",
                    "id": 1,
                    "description": "曲木为直终必弯，养狼当犬看家难。\n墨染鸬鹚黑不久，粉刷乌鸦白不坚。\n蜜饯黄莲终需苦，强摘瓜果不能甜。\n好事总得善人做，哪有凡人做神仙。",
                    "coverImgUrl": "../../../image/playlist/jinguqiguan.png"
                }        
            ]
        }
        
        return playlists || [];
    }
    
module.exports = {
    playlists: getPlaylists
}