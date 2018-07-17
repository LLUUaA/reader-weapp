// pages/chapterDetails/chapterDetails.js
Page({

  data: {
    bookId:null
  },

  onLoad: function (options) {
    const { bookId } = options;
    this.setData({
      bookId
    })
  },

  onShareAppMessage: function () {
  
  }
})