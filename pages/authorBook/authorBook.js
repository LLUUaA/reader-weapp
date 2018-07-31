// pages/authorBook/authorBook.js
import { getAuthorBook } from '../../service/book.js'

Page({

  data: {
    author:null,
    pageScroll:null
  },

  onLoad: function (options) {
    let author = options.author;

    if(!author) {
      wx.showToast({
        title: '未知作者，2秒后返回',
        icon:'none',
        duration:2000
      })

      wx.navigateBack();
      return;
    }

    wx.setNavigationBarTitle({
      title: author,
    })
    this.getAuhorBook(author);
    this.setData({
      author
    })

  },

  getAuhorBook(author) {
    getAuthorBook(author)
      .then(res=>{
        this.setData({
          authorBook: res
        })
      },err=>{
        wx.showToast({
          title: '请求失败，请重试。',
          icon:'noe'
        })
      })

  },

  onPageScroll(event) {
    this.setData({
      pageScroll: event
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.author + '的书籍',
      path:'/pages/authorBook/authorBook'
    }
  }
})