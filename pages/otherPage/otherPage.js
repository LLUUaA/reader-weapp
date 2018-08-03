// pages/otherPage/otherPage.js

import { getConfig } from '../../service/other.js';
import { Back } from '../../utils/Route.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHelpCenter: false,
    isAboutMe:false,
    aboutMe:null,
    helpContent:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    switch (options.pageName) {
      case 'isHelpCenter':

        wx.setNavigationBarTitle({
          title: '帮助中心',
        })
        this.setData({
          isHelpCenter: true
        })
        this.getHelp();
        break;
      case 'isAboutMe':

        wx.setNavigationBarTitle({
          title: '关于作者',
        })
        this.setData({
          isAboutMe: true
        })
        
        this.getAboutMe();
        break;
      default:
        wx.showModal({
          title: '提示',
          content: '未知页面！',
          showCancel:false,
          success:function(res) {
            if(res.confirm) {
              Back();
            }
          }
        })
        return;
    }
  },


  alertWeixin(){
    wx.previewImage({
      urls: [this.data.aboutMe.weixinQrCode],
    })
  },

  showQrcode(event) {
    const { index } = event.target.dataset;
    if(!index) return;
    let imgs = [];
    imgs.push(this.data.aboutMe.weixinPay);
    imgs.push(this.data.aboutMe.aliPay);

    wx.previewImage({
      current: imgs[index - 1],
      urls: imgs,
    })

  },

  getAboutMe() {
    getConfig({
      name: 'aboutMe'
    }).then(res => {
      this.setData({
        aboutMe: res
      })
    })
  },

  getHelp() {
    getConfig({
      name: 'helpCenter'
    }).then(res => {
      this.setData({
        helpContent: res
      })
    })
  },

  openQuestion(event) {
    let index = event.currentTarget.id;
    let helpContent = this.data.helpContent;
    helpContent[index].open = !helpContent[index].open;
    this.setData({
      helpContent
    })
  },

  onShareAppMessage: function () {

  }
})