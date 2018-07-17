// pages/reader/reader.js

import { readBook } from '../../service/book.js';
import { updateChapter } from '../../utils/book.js';

Page({

  data: {

  },

  onLoad: function(options) {
    const { bookId, chapterNum } =  options;

    if(!bookId) return;
    this.setData({
      bookId
    })
    this.getReader(bookId,chapterNum);
  },


  /**
   * @function getReader 获取内容
   * @param {Number} bookId 
   * @param {Number} chapterNum
   */
  getReader(bookId, chapterNum=1) {
    readBook(bookId, chapterNum)
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.chapterName || 'reader'
        })
        this.setData({
          chapterNum,
          chapterName: res.chapterName,
          chapterContent: res.chapterContent || []
        }, () => {
          updateChapter(bookId, chapterNum);
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
        })
      })
  },

  /**
   * @function switchChapter 切换章节
   * @param {Number} next 默认下一页
   */
  switchChapter(event) {
    const bookId = this.data.bookId;
    const next = event.target.dataset.switchType;
    let chapterNum = this.data.chapterNum;
    chapterNum = next === 2 ? ++chapterNum : --chapterNum;
    this.getReader(bookId, chapterNum);
    updateChapter(bookId,chapterNum);
  },

  onShareAppMessage: function() {

  }
})