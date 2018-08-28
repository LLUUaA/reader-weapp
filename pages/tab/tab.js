// pages/tab/tab.js
import {
  getHotBook,
  getBookType
} from '../../service/book.js';
import { Throttle, rgbaToHex } from '../../utils/lib/index.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotBook: null,
    nextPage: null,
    totalBook: null,
    showType: null,
    pageScroll: null,
    cateQuery:null//节点信息
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

  lastSetNav:{},
  handleCate(scrollTop) {
    let cateQuery = this.data.cateQuery;
    if (!cateQuery || !cateQuery.height) return;
    let per = parseFloat((scrollTop / (cateQuery.height + 20)).toFixed(2));
    per = per > 1 ? 1 : per;
    cateQuery.per = per;
    let color, fColor;
    if (per <= 0.3 ) {
      color = '#ffffff';
      fColor = '#000000';
    }else{
      color = '#333333';
      fColor = '#ffffff';
    }
    if ( this.lastSetNav.color !== color) {
      wx.setNavigationBarColor({
        frontColor: fColor,
        backgroundColor: color,
        animation: {
          duration: 300
        }
      })
    }
    this.lastSetNav.color = color;
    this.lastSetNav.fColor = fColor;

    if (this.data.per === 1 && per === 1) return;
    this.setData({
      cateQuery
    })
  },

  getCateHeight() {
    var query = wx.createSelectorQuery() 
    query.select('#cate').boundingClientRect(rect=>{
      this.setData({
        cateQuery: rect
      })
    }).exec();
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
    let maleMenu = this.data.maleMenu;
    let femaleMenu = this.data.femaleMenu;
    resetCurrent().then(() => {
      switch (cate) {
        case 'male':
          // let maleMenu = this.data.maleMenu;
          maleMenu[index].current = !maleMenu[index].current;
          this.getBookType(maleMenu[index].href);
          this.setData({
            maleMenu
          })
          break;
        case 'female':
          // let femaleMenu = this.data.femaleMenu;
          femaleMenu[index].current = !femaleMenu[index].current;
          this.getBookType(femaleMenu[index].href);
          this.setData({
            femaleMenu
          })
          break;
        case 'other':
          let href;
          if(index == 1) {
            href = '';
          }else if(index == 2) {
            href = maleMenu[0].href;
            maleMenu[0].current = true;
          }else if(index ==3) {
            href = femaleMenu[0].href;
            femaleMenu[0].current = true;
          }
          this.getBookType(href);
          this.setData({
            maleMenu,
            femaleMenu
          })
          wx.pageScrollTo({
            scrollTop: 0,
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
        },()=>{
         this.getCateHeight();
        })
      }, err => {
        wx.stopPullDownRefresh();
      })
  },

  onPageScroll(event) {
    Throttle(this.handleCate.bind(this, event.scrollTop));
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