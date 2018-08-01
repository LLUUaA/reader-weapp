// pages/chapterDetails/chapterDetails.js
Page({

  data: {
    bookId:null,
    fromReader:null,
    pageScroll: null
  },

  onLoad: function (options) {
    const { bookId  } = options;
    this.setData({
      bookId
    })
  },

  onPageScroll(event) {
    this.setData({
      pageScroll: event
    })
  }
})