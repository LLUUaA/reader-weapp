// pages/reader/reader.js

import { readBook,  getLastRead } from '../../service/book.js';
import { updateChapter, checkBookShelf } from '../../utils/book.js';
import { Throttle } from '../../utils/lib/index.js';
const READER_SETTING_KEY = 'readerSettingKey'; //阅读设置key
const fontSizeInterval = {
  max: 40,
  min: 26
}; //字体区间 step->2rpx

const lineHeightInterval = {
  max: 2.5,
  min: 1.5
}; //行高区间 step->0.1

const backgroundList = ['#EAEAEF', '#FDE6E0', '#FAF9DE', '#DCE2F1', '#E3EDCD', '#DCE2F1', '#E9EBFE'];
const app = getApp();

Page({
  data: {
    bookId: null,
    chapterNum: null,
    chapterName: null,
    chapterContent: null,
    backgroundList: backgroundList,
    readerSetting: null, //阅读设置（字号、行高、背景）
    showSetting: null,
    hideLastReadTimes: 5, //3秒后隐藏
    lastReadChapterNum: null,
    showLastRead: false,
    readerIndex: 0,//阅读章节index
    readerHeight:null,//阅读区域高度
    windowHeight:null
  },

  isReaderPage: true,
  onLoad: function (options) {
    const {
      bookId,
      chapterNum
    } = options;

    if (!bookId) return;

    this.getReader(bookId, chapterNum)
      .then(res => {
        this.getLastRead(bookId)
      })

    this.getReaderSetting();
    this.setData({
      bookId
    })
  },

  onShow() {
    if (app.chapterInfo) {
      const {
        bookId,
        chapterNum
      } = app.chapterInfo;

      if (!bookId) return;
      this.setData({
        bookId
      })
      this.getReader(bookId, chapterNum,0);
      this.getReaderSetting();
      delete app.chapterInfo;
    }

    if (app.bookInfo) {
      wx.setNavigationBarTitle({
        title: app.bookInfo.bookName || 'reader'
      })
      delete app.bookInfo;
    }
  },

  toLastRead() {
    this.getReader(this.data.bookId, this.data.lastReadChapterNum,0);
    this.clear();
  },

  clear() {
    if (this.getLastRead.timer) {
      clearInterval(this.getLastRead.timer);
      this.getLastRead.timer = null;
      this.setData({
        showLastRead: null
      })
    }
  },

  getLastRead(bookId) {
    if (checkBookShelf(bookId).isExist) {
      //如果加入了书架
      return;
    }
    getLastRead(bookId).then(res => {
      if (!res || res === 1) return; //如果没有看过或者是第一章
      this.getLastRead.timer = setInterval(() => {
        let hideLastReadTimes = this.data.hideLastReadTimes;
        if (hideLastReadTimes === 0) {
          this.clear();
          return;
        }
        hideLastReadTimes--;
        this.setData({
          hideLastReadTimes: hideLastReadTimes
        })
      }, 1000);
      this.setData({
        lastReadChapterNum: res,
        showLastRead: true
      })
    }, err => {

    })
  },

  touchstart: null,
  // move事件处理
  moveEvent(event) {
    const getDirection = (touchEnd) => {
      const touchStart = this.touchstart;
      const offsetX = 40,
        offsetY = 50;
      const moveX = touchEnd.clientX - touchStart.clientX,
        moveY = Math.abs(touchEnd.clientY - touchStart.clientY);

      if (moveX > offsetX && moveY < offsetY) {
        //向右划
        return 'left'
      }

      if (moveX < -offsetX && moveY < offsetY) {
        //向左划
        return 'right'
      }

      return 0;
    }

    switch (event.type) {
      case "touchstart":
        this.touchstart = event.touches[0];
        break;
      case "touchmove":
        break;
      case "touchend":
        const bookId = this.data.bookId;
        let chapterNum = this.data.chapterNum;
        switch (getDirection(event.changedTouches[0])) {
          case 'left':
            // wx.vibrateShort();
            this.getReader(bookId, --chapterNum, 0);
            break;
          case 'right':
            // wx.vibrateShort();
            this.getReader(bookId, ++chapterNum, 0);
            break;
          default:
            return;
        }
        break;
    }
  },

  getReaderSetting() {
    const setting = wx.getStorageSync(READER_SETTING_KEY) || this.defaultSetting;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: setting.bgColor,
    })
    this.setData({
      readerSetting: setting
    })
  },

  changeSetting(event) {
    const {
      cate,
      handle,
      index
    } = event.target.dataset;
    let readerSetting = this.data.readerSetting;
    switch (cate) {
      case 'size':
        switch (handle) {
          case 'add':
            if (readerSetting.fontSize >= fontSizeInterval.max) {
              wx.showToast({
                title: `最大字号为${fontSizeInterval.max / 2}哦 (＞﹏＜)`,
                icon: 'none'
              })
              return;
            }
            readerSetting.fontSize += 2; //step=2
            break;
          case 'reduce':
            if (readerSetting.fontSize <= fontSizeInterval.min) {
              wx.showToast({
                title: `最小字号为${fontSizeInterval.min / 2}哦 (＞﹏＜)`,
                icon: 'none'
              })
              return;
            }
            readerSetting.fontSize -= 2; //step=2
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
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: readerSetting.bgColor,
        })
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

  closeSetting() {
    this.setData({
      showSetting: false
    })
  },

  /**
   * @function getReader 获取内容
   * @desc 获取到之后获取下一章
   * @param {Number} bookId 
   * @param {Number} chapterNum
   */
  getReader(bookId, chapterNum = 1, readerIndex) {
    return new Promise((resolve, reject) => {
      if (this.getReader._lock) return;
      this.getReader._lock = true;
      wx.showNavigationBarLoading();
      readBook(bookId, chapterNum)
        .then(res => {
          wx.hideNavigationBarLoading();
          this.getReader._lock = false;
          resolve();
          if (!res || !res.chapterContent.length) return;

          readerIndex = readerIndex >= 0 ? readerIndex : this.data.readerIndex;
          let key = `chapterContent[${readerIndex}]`;

          readerIndex++;
          res.key = Math.round(new Date().getTime() / 1000);

          if (readerIndex === 1) {
            this.setData({
              chapterContent: [res]
            })
          } else {
            this.handleScroll._lock = false;//解锁(当触底加载时)
            this.setData({
              [key]: res
            })
          }

          this.setData({
            chapterNum,
            readerIndex,
          }, () => {
            updateChapter(bookId, chapterNum);
            this.readerSelectQuery();
            //左右滑动或者第一章
            if (readerIndex === 1) {
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
            }
          })
        }, err => {
          reject();
          this.handleScroll._lock = false;//失败解锁
          this.getReader._lock = false;
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '获取失败，请重试。',
            icon: 'none'
          })
        })
    })
  },

  /**
 * @function switchChapter 切换章节
 * @param {Number} next 默认下一页
 */
  switchChapter(event, nextPage) {
    const bookId = this.data.bookId;
    const next = nextPage ? true : event.target.dataset.switchType === 2;
    let chapterNum = this.data.chapterNum;
    chapterNum = next ? ++chapterNum : --chapterNum;
    this.getReader(bookId, chapterNum, nextPage ? -1 : 0);
  },

  toChapterDetails() {
    wx.navigateTo({
      url: `../chapterDetails/chapterDetails?bookId=${this.data.bookId}`
    })

    this.closeSetting();
  },

  /**
   * @function readerSelectQuery 切换章节
   * @desc 查询reader 分页加载用
   */
  readerSelectQuery() {
    const query = wx.createSelectorQuery();
    query.select("#reader").boundingClientRect((rect) => {
      /**
       * 公式：windowHeight/ (readerHeigth - scrollTop) 
       *  readerHeigth - scrollTop为触底时的距离 ，整个结果为触底是的比例高度，这里取1.4
       * 
       * iphone 5 1.48
       * iphone 6 1.47
       * iphone 6s 1.49
       * 
       */
      this.setData({
        readerHeight: parseInt(rect.height / 1.4),
        windowHeight: this.getSysInfo().windowHeight || 672
      })
    }).exec();
  },


  /**
   * @function getSysInfo
   * @desc 获取手机信息
   * @returns object
   */
  systemInfo: null,
  getSysInfo() {
    if (this.systemInfo) return this.systemInfo;
    this.systemInfo = wx.getSystemInfoSync();
    return this.systemInfo;
  },

  defaultSetting: {
    fontSize: 28,
    bgColor: '#EAEAEF',
    lineHeight: 2
  },

  onUnload: function () {
    this.clear();
  },

  handleScroll(scrollTop){
    if (this.handleScroll._lock) return;
    const readerHeight = this.data.readerHeight;
    const windowHeight = this.data.windowHeight;
    
    if (windowHeight > readerHeight - scrollTop ) {
      this.handleScroll._lock = true;
      this.switchChapter(1,true); //下一章
    }
  },

  onPageScroll(event) {
    Throttle(this.handleScroll.bind(this, event.scrollTop));
  },

  onReachBottom: function () {
    // this.switchChapter(1,true); //下一章
  },

  onShareAppMessage: function () {
    return app.getShareMsg({
      title: this.data.chapterName || 'Reader',
      path: `pages/reader/reader?bookId=${this.data.bookId}&chapterNum=${this.data.chapterNum}`,
      key: 'reader'
    });
  }
})