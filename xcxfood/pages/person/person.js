const app = getApp();

Page({
  data: {
    user: app.globalData.user,
    BASE: app.globalData.BASE,
    CDN: app.globalData.BASE.config.CDN,
    loadingHidden: true 
  },
  onLoad() 
  {
    //获取本地用户信息
    this.setData({
      user: wx.getStorageSync('user')
    });
  },
  userInfo(e) 
  {
    var that = this
    //用户信息
    var userinfo = e.detail.userInfo;

    if(userinfo) 
    {
      wx.login({
        success(login) 
        {
          var data = {
            nickname: userinfo.nickName,
            gender: userinfo.gender,
            code: login.code
          };
          
          that.data.BASE.request.post('/user.php?action=login', data).then(res => 
          {
            if(res.result) 
            {
              wx.setStorageSync('user', res.data);
              that.setData({
                user: res.data
              })
            }
          })
        }
      })
    }
  },
  updateAvatar(e) 
  {
    let that = this;
    //上传头像
    wx.chooseImage({
      count: 1,  
      sizeType: ["compressed"],
      success: function(res) {
        //上传头像地址
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

        //提交数据
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
        });
      }
    })
  },
  clearCache() {
    var that = this;

    //清空本地缓存
    wx.clearStorage({
      success() 
      {
        that.data.BASE.common.getUser(function(res) 
        {
          //重新设置本地存储
          wx.setStorageSync("user", res.data);

          that.data.BASE.common.showToast("清除缓存成功", 'success');
        })  
      }
    })
  }
})