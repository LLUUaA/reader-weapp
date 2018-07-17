// pages/reader/reader.js

import { readBook } from '../../service/book.js';
import { updateChapter } from '../../utils/book.js';
const READER_SETTING_KEY = 'readerSettingKey';//阅读设置key
const fontSizeInterval = {
  max: 40,
  min: 26
};//字体区间 step->2rpx

const lineHeightInterval = {
  max: 2.5,
  min: 1.5
};//行高区间 step->0.1

const backgroundList = ['#333333', '#e1e1e1'];

Page({

  data: {
    bookId: null,
    chapterNum: null,
    chapterName: null,
    chapterContent: null,
    backgroundList: backgroundList,
    readerSetting: null,//阅读设置（字号、行高、背景）
    showSetting: null
  },

  onLoad: function (options) {
    const { bookId, chapterNum } = options;

    if (!bookId) return;
    this.setData({
      bookId
    })
    this.getReader(bookId, chapterNum || 1);
    this.getReaderSetting();
  },

  getReaderSetting() {
    const setting = wx.getStorageSync(READER_SETTING_KEY) || this.defaultSetting;
    this.setData({
      readerSetting: setting
    })
  },

  changeSetting(event) {
    const { cate, handle, index } = event.target.dataset;
    let readerSetting = this.data.readerSetting;
    switch (cate) {
      case 'size':
        switch (handle) {
          case 'add':
            if (readerSetting.fontSize >= fontSizeInterval.max) {
              wx.showToast({
                title: `最大字号为${fontSizeInterval.max}哦 (＞﹏＜)`,
                icon: 'none'
              })
              return;
            }
            readerSetting.fontSize += 2;//step=2
            break;
          case 'reduce':
            if (readerSetting.fontSize <= fontSizeInterval.min) {
              wx.showToast({
                title: `最小字号为${fontSizeInterval.min}哦 (＞﹏＜)`,
                icon: 'none'
              })
              return;
            }
            readerSetting.fontSize -= 2;//step=2
            break;
          default:
            break;
        }
        break;
   
      case 'line':
        switch (handle) {
          case 'add':
            if (readerSetting.lineHeight >= lineHeightInterval.max) {
              wx.showToast({
                title: `最大行高为${lineHeightInterval.max}哦 (＞﹏＜)`,
                icon: 'none'
              })
              return;
            }
            readerSetting.lineHeight = (readerSetting.lineHeight * 10 + 1) / 10;
            break;
          case 'reduce':
            if (readerSetting.lineHeight <= lineHeightInterval.min) {
              wx.showToast({
                title: `最小行高为${lineHeightInterval.min}哦 (＞﹏＜)`,
                icon: 'none'
              })
              return;
            }
            readerSetting.lineHeight = (readerSetting.lineHeight * 10 - 1) / 10
            break;
          default:
            break;
        }
        break;
      case 'bg':
        readerSetting.bgColor = backgroundList[index];
        break;
      default:
      return;
    }

    this.setData({
      readerSetting
    })

    wx.setStorage({
      key: READER_SETTING_KEY,
      data: readerSetting,
    })
  },

  handleShowSetting() {
    let showSetting = this.data.showSetting;
    this.setData({
      showSetting: !showSetting
    })
  },

  /**
   * @function getReader 获取内容
   * @param {Number} bookId 
   * @param {Number} chapterNum
   */
  getReader(bookId, chapterNum = 1) {
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
    updateChapter(bookId, chapterNum);

  },

  defaultSetting: {
    fontSize: 28,
    bgColor: '#e1e1e1',
    lineHeight: 2
  },

  onShareAppMessage: function () {

  }
})