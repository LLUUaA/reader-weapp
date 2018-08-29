// pages/bookDetail/bookDetail.js

import { getBook } from '../../service/book.js';
import { addBookShelf, checkBookShelf } from '../../utils/book.js';
const app = getApp()

Page({

  data: {
    bookId: null,
    isAddBookShelf: false,//是否加入书架
    lastChapterNum: null,//上一次阅读章节
    pageScroll: null
  },
  onLoad: function (options) {
    this.setData({
      bookId: options.bookId
    })

    this.getBookDetail(options.bookId);
    this.checkAddBookShelf(options.bookId);
  },


  toAuthorBook(){
    wx.navigateTo({
      url: '../authorBook/authorBook?author=' + this.data.bookInfo.bookAuthor,
    })
  },

  //检查是否加入书架
  checkAddBookShelf(bookId) {
    const checkBack = checkBookShelf(bookId);
    this.setData({
      isAddBookShelf: checkBack.isExist,
      lastChapterNum: checkBack.readChapter || 1,
    })
  },

  getBookDetail(bookId) {
    wx.showNavigationBarLoading();
    getBook(bookId)
      .then(res => {
        wx.hideNavigationBarLoading();
        this.setData({
          bookInfo: res.bookInfo
        })
      },err=>{
        wx.hideNavigationBarLoading();
      })
  },

  toReader(event) {
    wx.navigateTo({
      url: `../reader/reader?bookId=${this.data.bookId}&chapterNum=${this.data.lastChapterNum}`
    })
  },

  addBookshelf() {
    const isAddBookShelf = this.data.isAddBookShelf;
    const bookInfo = this.data.bookInfo;
    let bookShelf = {};//缓存的数据

    bookShelf.bookName = bookInfo.bookName;
    bookShelf.coverImg = bookInfo.coverImg;

    bookShelf.bookId = this.data.bookId;
    bookShelf.readChapter = 1;
    addBookShelf(bookShelf, !isAddBookShelf, () => {
      this.setData({
        isAddBookShelf: !isAddBookShelf
      })
    });

  },

  toChapterDetails() {
    wx.navigateTo({
      url: `../chapterDetails/chapterDetails?bookId=${this.data.bookId}`
    })
  },

  onPageScroll(event) {
    this.setData({
      pageScroll: event
    })
  },

  onShareAppMessage: function () {
    // return {
    //   title: '搜索你想看的',
    //   path: 'pages/bookDetail/bookDetail?bookId=' + this.data.bookId
    // }

    return app.getShareMsg({
      title: this.data.bookInfo.bookName || '这是一本有趣的书,你也来看看吧。',
      path: 'pages/bookDetail/bookDetail?bookId=' + this.data.bookId,
      key: 'bookDetail'
    });
  }
})