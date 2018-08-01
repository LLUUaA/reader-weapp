// pages/search/search.js
import {
  searchBook
} from '../../service/book.js';
let lock = false;
const app = getApp()

Page({

  data: {
    searchValue: null,
    bookList: null,
    isLastPage: null,
    pageScroll:null,
    pageIndex: null
  },
  onLoad: function(options) {

  },

  inputTxt(event) {
    let value = event.detail.value;
    this.setData({
      searchValue: value
    })
  },
  clickSubmit(){
    this.submit();
  },

  submit(page = false) {
    const searchValue = this.data.searchValue || '';
    if (lock || this.data.isLastPage) return;
    if (!searchValue) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return;
    }

    wx.showLoading({
      title: '搜索中..',
    })
    lock = true;
    searchBook({
      keyword: searchValue,
      pageIndex: page ? this.data.pageIndex + 1 : 1
    }).then(res => {
;
      wx.hideLoading();
      lock = false;
      if (!res || !res.result.length) return

      let bookList = this.data.bookList||[];
      if(page){
        bookList = bookList.concat(res.result);
      }else{
        bookList = res.result;
      }

      this.setData({
        bookList,
        pageIndex: res.pager.pageIndex,
        isLastPage: !res.result || !res.result.length
      })
    }, () => {
      wx.hideLoading();
      lock = false;
      wx.showToast({
        title: '搜索失败，请重试',
        icon: 'none'
      })
    })
  },

  onReachBottom: function() {
    this.submit(true); //分页
  },

  onPageScroll(event) {
    this.setData({
      pageScroll: event
    })
  },

  onShareAppMessage: function() {
    // return {
    //   title: '搜索你想看的',
    //   path: 'pages/search/search'
    // }

    return app.getShareMsg({
      title: '搜索你想看的',
      path: 'pages/search/search',
      key: 'search'
    });
  }
})