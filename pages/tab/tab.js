// pages/tab/tab.js
import { getHotBook } from '../../service/book.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotBook:null
  },

  onLoad: function (options) {
    this.getBook();
  },

  onShow:function(){
    if(!getHotBook) {
      this.getBook();
    }
  }, 

  getBook(){
    getHotBook()
      .then(res => {
        this.setData({
          hotBook: res.hotBook
        })
      })
  },

  onShareAppMessage: function () {
  
  }
})