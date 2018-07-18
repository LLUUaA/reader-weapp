// pages/chapterDetails/chapterDetails.js
Page({

  data: {
    bookId:null,
    fromReader:null
  },

  onLoad: function (options) {
    const { bookId  } = options;
    this.setData({
      bookId
    })
  }
})