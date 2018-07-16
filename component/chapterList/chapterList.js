// component/chapterList/chapterList.js
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

        this.getChapterList(bookId);
      }
    },

    size: {
      type: Number,
      value: 10
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getChapterList(bookId) {
    
    }
  }
})
