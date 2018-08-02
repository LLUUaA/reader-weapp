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
    console.log(123,env);

  },

  onShareAppMessage: function () {
  
  }
})