// component/chapterList/chapterList.js
import { getChapterList } from '../../service/book.js'
import { Route } from '../../utils/Route.js';
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookId: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {
        if (!newVal) return;

        this.getChapter(newVal);
      }
    },

    size: {
      type: Number,
      value: 10
    },

    moreChapter: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    chapterList: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getChapter(bookId, pageIndex) {
      getChapterList(bookId, pageIndex)
        .then(res => {
          this.setData({
            chapterList: res.chapterList,
            chapterPager: res.chapterPager,
            pageIndex: res.pageIndex
          },()=>{
            wx.pageScrollTo({
              scrollTop: 0,
              duration: 0
            })
          })
        })
    },

    selectChapter(event) {
      const selectNum = parseInt(event.detail.value) + 1;
      this.getChapter(this.data.bookId, selectNum)
    },

    toReader(event) {
      const { chapterNum } = event.target.dataset;
      // wx.navigateTo({
      //   url: `/pages/reader/reader?bookId=${this.data.bookId}&chapterNum=${chapterNum || 1}`,
      // })

      app.chapterInfo = {
        bookId: this.data.bookId,
        chapterNum: chapterNum||1
      }

      Route({
        pageSign: 'isReaderPage',
        toUrl: `../reader/reader`
      })
    },

    switchPage(event) {
      const { page } = event.target.dataset;
      let pageIndex = this.data.pageIndex;
      switch (page) {
        case 'prev':
          this.getChapter(this.data.bookId, --pageIndex)
          break;
        case 'next':
          this.getChapter(this.data.bookId, ++pageIndex)
          break;
        default:
          return;
      }
    }
  }
})
