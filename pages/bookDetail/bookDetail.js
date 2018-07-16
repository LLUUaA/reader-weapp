// pages/bookDetail/bookDetail.js

import { getBook } from '../../service/book.js';
Page({

  data: {
    bookId:null
  },
  onLoad: function (options) {
    this.setData({
      bookId: options.bookId
    })

    this.getBookDetail(options.bookId)
  },

  getBookDetail(bookId){
    getBook(bookId)
      .then(res=>{

      })
  },

  toReader(event) {
    wx.navigateTo({
      url: `../reader/reader?bookId=${this.data.bookId}&chapterNum=${1}`
    })
  },

    toChapterDetails() {
    wx.navigateTo({
      url: `../chapterDetails/chapterDetails?bookId=${this.data.bookId}`
    })
  },

  onShareAppMessage: function () {
  
  }
})