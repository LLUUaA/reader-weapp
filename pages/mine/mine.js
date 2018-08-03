// pages/mime/mine.js
import env from '../../service/env.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: env.ver
  },

  onLoad: function (options) {

  },

  toPage(event) {
    const { page } = event.currentTarget.dataset;
    wx.navigateTo({
      url: '../otherPage/otherPage?pageName=' + page,
    })
  },

  onShareAppMessage: function () {
    return app.getShareMsg({
      title: this.data.chapterName || '我的',
      path: `pages/mine/mine`,
      key: 'reader'
    });
  }
})