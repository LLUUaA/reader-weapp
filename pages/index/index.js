//index.js
//获取应用实例

import { getAddBookShelf } from '../../utils/book.js';
const app = getApp()

Page({
  data: {
    bookShelfList:null
  },

  onLoad: function () {

  },

  onShow:function(){
   let bookShelfList = getAddBookShelf();
   this.setData({
     bookShelfList
   })
  },

  toReader(event){
    const { index } = event.target.dataset;
    const bookShelf = this.data.bookShelfList[index];

    if(!bookShelf) return;

    wx.navigateTo({
      url: `../reader/reader?bookId=${bookShelf.bookId}&chapterNum=${bookShelf.readChapter}`,
    })
  },

  toRoute(event) {
    const { path } = event.target.dataset;
    if (!path) return;
    let url = `../${path}/${path}`;
    if (path === 'tab') {
      wx.switchTab({
        url
      })
    } else {
      wx.navigateTo({
        url
      })
    }
  },

})
