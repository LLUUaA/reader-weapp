// pages/mime/mine.js
import env from '../../service/env.js';
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
  
  }
})