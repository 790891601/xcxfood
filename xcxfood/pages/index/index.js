//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      '../../image/recipe01.jpg',
      '../../image/recipe02.jpg',
      '../../image/recipe03.jpg',
      '../../image/recipe04.png',
      '../../image/recipe05.jpg',
      '../../image/recipe06.jpg'
    ],
    meunList: [
      '../../image/city.png',
      '../../image/all.png',
      '../../image/timer.png',
      '../../image/video_sel.png',
      '../../image/mahout.png'
    ],
    page: 0,
    limit: 10,
    indicatorDots: true,
    loadingHidden: true,
    BASE: app.globalData.BASE,
    hotFood: [],
    user: wx.getStorageSync('user')
  },
  requestFood: function (cateid, flag) {
    //请求食品
    let that = this,
      data = {
        page: that.data.page,
        limit: that.data.limit
      };

    if (cateid) {
      data.cateid = cateid
    }
    if (flag) {
      data.flag = flag;
    }
    return that.data.BASE.request.post("/food.php?action=food", data);
  },
  onLoad() {
    this.requestFood(null, 'hot').then(res => {
      if(res.result) {
        this.setData({
          hotFood: res.data
        });
      }
    });
  },
  loadFood: function(e) {
    let that = this;
    let { page, hotFood } = that.data;
    that.setData({
      page: page + 1,
      loadingHidden: false
    });

    //加载更多食物
    that.requestFood(null, 'hot').then(function (res) {
      that.setData({
        loadingHidden: true
      });
      if (res.result) 
      {
        that.setData({
          food: food.concat(res.data)
        })
      }
    });
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

    let {id} = e.target.dataset;

    let data = {
      'userid': that.data.user.id,
      'foodid': id
    }
    that.data.BASE.request.post("/food.php?action=collection", data)
    .then(function(res) 
    {
      that.data.BASE.common.showToast(res.msg);
    })
  }
})