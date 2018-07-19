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
    // this.getBook();
  },

  onShow:function(){
    if (!this.data.hotBook) {
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
    return {
      title: '给你想看的',
      path: 'pages/tab/tab'
    }
  }
})