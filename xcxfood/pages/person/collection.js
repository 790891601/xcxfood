var app = getApp();
Page({
  data: {
    winHeight: "400",
    currentTab: 0,
    scrollLeft: 0,
    BASE: app.globalData.BASE,
    food: [],
    page: 0,   //当前页面
    limit: 10,   //每次请求返回数据总数
    loadingHidden: true,
    cateid: 'all',
    user: wx.getStorageSync('user')
  },
  requestFood: function() {
     //请求食品
    let that = this,
        data = {
          page: that.data.page,
          limit: that.data.limit,
          userid: that.data.user.id
        };
    return that.data.BASE.request.post("/food.php?action=collectionlist", data);
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;

        that.setData({
          winHeight: calc
        });
      }
    }); 

    that.requestFood().then(function(res) {
      if(res.result) {
        that.setData({
          food: res.data
        })
      }
    })
  },
  loadFood: function(e) {
    let that = this;
    let { page, food} = that.data;
    that.setData({
      loadingHidden: false,
      page: page+1
    });

    //加载更多食物
    that.requestFood().then(function (res) {
      that.setData({
        loadingHidden: true
      });
      if (res.result) {
        that.setData({
          food: food.concat(res.data)
        })
      }
    });
  },
  footerTap: app.footerTap
})