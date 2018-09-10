//index.js
//获取应用实例

import { getAddBookShelf,addBookShelf } from '../../utils/book.js';

const app = getApp()

Page({
  data: {
    bookShelfList:null
  },

  onLoad: function () {

  },

  onShow:function(){
    this.getShelf();
  },

  getShelf() {
    getAddBookShelf()
    .then(res=>{
      this.setData({
        bookShelfList:res
      })
    })

  },

  longTapBook(event){
    const { index } = event.target.dataset;
    const bookShelf = this.data.bookShelfList[index];

    wx.showActionSheet({
      itemList: ['移出书架','查看详情'],
      success: (res)=>{
        let index = res.tapIndex;

        switch (index) {
          case 0:
            addBookShelf(bookShelf, false, () => {
              let bookShelfList = this.data.bookShelfList;
              bookShelfList.splice(index, 1);
              this.setData({
                bookShelfList
              })
            });
            break;
          case 1:
          wx.navigateTo({
            url: '../bookDetail/bookDetail?bookId=' + bookShelf.bookId,
          })
            break;
          default:
            return;
        };
      }
    })

  },

  toReader(event){
    const { index } = event.target.dataset;
    const bookShelf = this.data.bookShelfList[index];

    if(!bookShelf) return;

    app.bookInfo = bookShelf;
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

  onShareAppMessage: function () {

    // return {
    //   title: '青莲一叶',
    //   path: 'pages/index/index'
    // }

    return app.getShareMsg({
      title: '青莲一叶',
      path: 'pages/index/index',
      key:'index'
    });
  }

})
