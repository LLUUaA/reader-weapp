// pages/tab/tab.js
import {
  getHotBook,
  getBookType
} from '../../service/book.js';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotBook: null,
    nextPage: null,
    totalBook: null,
    showType: null,
    pageScroll: null
  },

  onLoad: function (options) {
    // this.getBook();
  },

  onShow: function () {
    if (!this.data.hotBook) {
      this.getBook();
      this.setData({
        showType: app.gConfig.tab ? app.gConfig.tab.showBookType : false,
      })
    }
  },


  /**
   * @desc 获取分类
   */
  getBookType(type, page = false) {

    let nextPage = this.data.nextPage;
    if (page && !nextPage) return;

    wx.showNavigationBarLoading();
    getBookType(page ? nextPage : type)
      .then(res => {
        let hotBook = this.data.hotBook || [],
          nextPage;
        if (page) {
          hotBook = hotBook.concat(res.bookList);
        } else {
          hotBook = res.bookList;
        }

        wx.hideNavigationBarLoading();
        this.setData({
          hotBook,
          totalBook: res.total,
          nextPage: res.nextPage
        })
      }, err => {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      })
  },

  choose(event) {
    const { cate } = event.currentTarget.dataset;
    const { index } = event.target.dataset;

    if (undefined === index) return;

    const resetCurrent = () => {
      return new Promise((resolve, reject) => {
        let maleMenu = this.data.maleMenu;
        let femaleMenu = this.data.femaleMenu;

        maleMenu.forEach((item, index) => {
          item.current = false;
        })

        femaleMenu.forEach((item, index) => {
          item.current = false;
        })

        this.setData({
          maleMenu,
          femaleMenu
        }, () => {
          resolve();
        })

      })
    }

    resetCurrent().then(() => {
      switch (cate) {
        case 'male':
          let maleMenu = this.data.maleMenu;
          maleMenu[index].current = !maleMenu[index].current;

          this.getBookType(maleMenu[index].href);
          this.setData({
            maleMenu
          })
          break;
        case 'female':
          let femaleMenu = this.data.femaleMenu;
          femaleMenu[index].current = !femaleMenu[index].current;
          this.getBookType(femaleMenu[index].href);
          this.setData({
            femaleMenu
          })
          break;
        default:
          return;
      }
    })
  },

  getBook() {
    getHotBook()
      .then(res => {
        wx.stopPullDownRefresh();
        this.setData({
          totalBook: null,
          hotBook: res.hotBook,
          maleMenu: res.maleMenu,
          femaleMenu: res.femaleMenu
        })
      }, err => {
        wx.stopPullDownRefresh();
      })
  },

  onPageScroll(event) {
    this.setData({
      pageScroll: event
    })
  },

  onPullDownRefresh: function () {
    this.getBook();

  },

  onReachBottom: function () {

    this.getBookType(this.data.nextPage, true);
  },

  onShareAppMessage: function () {
    return app.getShareMsg({
      title: '给你想看的',
      path: 'pages/tab/tab',
      key: 'tab'
    });
  }
})