// pages/bookDetail/bookDetail.js

import { getBook } from '../../service/book.js';
import { addBookShelf, checkBookShelf } from '../../utils/book.js';
Page({

  data: {
    bookId: null,
    isAddBookShelf: false
  },
  onLoad: function (options) {
    this.setData({
      bookId: options.bookId
    })

    this.getBookDetail(options.bookId);
    this.checkAddBookShelf(options.bookId);
  },

//检查是否加入书架
  checkAddBookShelf(bookId) {
    const checkBack = checkBook(book.bookId);
    this.setData({
      isAddBookShelf: checkBack.isExist
    })
    return checkBack.readChapter
  },

  getBookDetail(bookId) {
    getBook(bookId)
      .then(res => {
        this.setData({
          bookInfo: res.bookInfo
        })
      })
  },

  toReader(event) {
    wx.navigateTo({
      url: `../reader/reader?bookId=${this.data.bookId}&chapterNum=${1}`
    })
  },

  addBookshelf() {
    let bookInfo = this.data.bookInfo;
    let bookShelf = {};//缓存的数据

    bookShelf.bookName = bookInfo.bookName;
    bookShelf.coverImg = bookInfo.coverImg;

    bookShelf.bookId = this.data.bookId;
    bookShelf.readChapter = 1;
    addBookShelf(bookShelf);
    this.setData({
      isAddBookShelf: true
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