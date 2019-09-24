var app = getApp();
Page({
  data: {
    winHeight: "400",
    currentTab: 0,
    scrollLeft: 0,
    BASE: app.globalData.BASE,
    food: [],
    foodCate: [],
    page: 0,   //当前页面
    limit: 10,   //每次请求返回数据总数
    loadingHidden: true,
    cateid: 'all',
    user: app.globalData.user
  },
  switchTab: function (e) {
    console.log(e)
    this.setData({
      currentTab: e.detail.current,
      cateid: e.detail.current,
      page: 0
    });

    this.requestFood(e.detail.current).then(res => {
      console.log(res)
      if(res.result) {
        this.setData({
          food: res.data
        })
      }
    })
    this.checkCor();
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  checkLogin() {
    if (!this.data.user) {
      this.data.BASE.common.showToast("请先登录", "none", "/pages/person/person", "switchTab");
      return true;
    }
  },
  collection(e) {
    //收藏
    let that = this;

    if (this.checkLogin()) {
      return false;
    }

    let { id } = e.target.dataset;

    let data = {
      'userid': that.data.user.id,
      'foodid': id
    }
    that.data.BASE.request.post("/food.php?action=collection", data)
    .then(function (res) {
      that.data.BASE.common.showToast(res.msg);
    })
  },
  requestFood: function(cateid, flag) {
     //请求食品
    let that = this,
        data = {
          page: that.data.page,
          limit: that.data.limit
        };
        
    if(cateid) {
      data.cateid = cateid
    }
    if(flag) {
      data.flag = flag;
    }
    return that.data.BASE.request.post("/food.php?action=food", data);
  },
  requestFoodCate: function() {
    return this.data.BASE.request.post("/food.php?action=foodcate", {});
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    }); 

    //初始化请求分类
    that.requestFoodCate().then(function(res) {
      if(res.result) {
        that.setData({
          foodCate: res.data,
          cateid: res.data[0].id,
          currentTab: res.data[0].id
        })
        return res.data[0].id;
      }
    }).then(cateid => that.requestFood(cateid))
    .then(res => {
      if (res.result) {
        that.setData({
          food: res.data
        })
      }
    });
  },
  loadFood: function(e) {
    let that = this;
    let {cateid, page, food} = that.data;
    that.setData({
      loadingHidden: false,
      page: page+1
    });

    //加载更多食物
    that.requestFood(cateid).then(function (res) {
      that.setData({
        loadingHidden: true
      });
      if (res.result) {
        console.log(food.concat(res.data))
        that.setData({
          food: food.concat(res.data)
        })
      }
    });
  },
  footerTap: app.footerTap
})