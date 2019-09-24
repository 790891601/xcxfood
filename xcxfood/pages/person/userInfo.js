const app = getApp()

Page({
  data: {
    user: app.globalData.user,
    BASE: app.globalData.BASE,
    CDN: app.globalData.BASE.config.CDN,
    loadingHidden: true,
    sexItems: [
      { name: '男', value: '1', },
      { name: '女', value: '2' }
    ],
  },
  onLoad() 
  {
    this.setData({
      user: wx.getStorageSync("user")
    })
  },
  //切换性别按钮
  radioChange: function (e) {
    this.setData({
      "user.gender": e.detail.value
    });
  },
  userInfo: function(e) {
    var that = this;
    //发送请求
    let data = e.detail.value;
    data['avatar'] = this.data.user.avatar;
    data['id'] = this.data.user.id;
    this.data.BASE.request.post("/user.php?action=userinfo", data).then(user => {
      if (user.result) 
      {
        //更新持久化数据
        wx.setStorageSync("user", user.data)
        //更新用户数据
        that.setData({
          user: user.data
        });
      }
      wx.navigateBack();
    });
  },
  changeAvatar: function() {
    let that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      success: function(res) {
        const tempFilePath = res.tempFilePaths[0];

        //封装一个数据
        let fileData = {
          name: 'avatar',
          url: "/file.php?action=updateAvatar",
          filePath: tempFilePath,
          requestData: {
            userid: that.data.user.id
          }
        }

        //显示加载中
        that.setData({
          loadingHidden: false
        })

        that.data.BASE.request.FileData(fileData, function(user) {
          user = JSON.parse(user);

          that.setData({
            loadingHidden: true
          });

          //更新持久化数据
          wx.setStorageSync("user", user.data)
          //更新用户数据
          that.setData({
            user: user.data
          });

          //刷新页面
          let pages = getCurrentPages();
          let currentPage = pages[pages.length - 1];
          currentPage.onLoad();
        })
      }
    })
  }
})