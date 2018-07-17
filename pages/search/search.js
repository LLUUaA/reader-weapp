// pages/search/search.js
import { searchBook } from '../../service/book.js';
let lock = false;
Page({

  data: {

  },
  onLoad: function (options) {

  },

  inputTxt(event) {
    let value = event.detail.value || event.target.value;
    this.setData({
      searchValue: value
    })
  },

  submit() {
    const searchValue = this.data.searchValue || '';
    if (lock) return;
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
      pageIndex: 1
    }).then(res => {
      wx.hideLoading();
      lock = false;
      this.setData({
        bookList: res.result
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

  onShareAppMessage: function () {

  }
})